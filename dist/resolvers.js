"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./models/User");
const { Game } = require("./models/Game");
const { Storage } = require('@google-cloud/storage');
const { GraphQLUpload } = require('apollo-upload-server');
const { AuthenticationError } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { sign } = require("jsonwebtoken");
const { getToken, encryptPassword, comparePassword } = require("./utils/main.utils");
const gc = new Storage({
    keyFileName: path.join(__dirname, '../gamesshop-bf1925847484.json'),
    projectId: 'gamesshop'
});
exports.resolvers = {
    Upload: GraphQLUpload,
    Query: {
        games: (_, args, context) => {
            const refresh_token = sign({ userId: "123" }, "secret", { expiresIn: "7d" }, {
                maxAge: 60 * 60,
                sameSite: 'lax',
            });
            // res.cookie('refresh-token', refresh_token, {expire: 60 * 60 * 24 * 7},) // 7 days
            // res.cookie('access-token', access_token, {expire: 60 * 15}) // 15 mins
            context.setCookies.push({
                name: "refresh-token",
                value: refresh_token,
                options: {
                    expires: new Date("2021-01-01T00:00:00"),
                    httpOnly: true,
                    maxAge: 3600,
                    path: "/",
                    sameSite: false,
                    secure: false
                }
            });
            return Game.find();
        }
    },
    Mutation: {
        createGame: (_, { title, type, price, image, video }, { res }) => __awaiter(this, void 0, void 0, function* () {
            const GAMES_BUCKET = 'games-shop-bucket';
            const { createReadStream, filename } = yield image;
            try {
                const stream = createReadStream();
                const myBucket = gc.bucket(GAMES_BUCKET);
                yield stream.pipe(myBucket.file(filename).createWriteStream({
                    resumamble: false,
                    gzip: true
                }));
                const game = new Game({
                    title,
                    type,
                    price,
                    image: `/${GAMES_BUCKET}/${filename}`,
                    video
                });
                yield game.save();
                const games = Game.find();
                const refresh_token = sign({ userId: "123" }, "secret", { expiresIn: "7d" });
                const access_token = sign({ userId: "123" }, "secret", { expiresIn: "15min" });
                res.cookie('refresh-token', refresh_token, { expire: 60 * 60 * 24 * 7 }); // 7 days
                res.cookie('access-token', access_token, { expire: 60 * 15 }); // 15 mins
                return { response: "Game successfully saved", games };
            }
            catch (error) {
                return { response: `Saving game failed-${error}`, games: [] };
            }
        }),
        register: (_, { firstname, lastname, phone, email, password, city, country, postcode, isAdmin }, { req }, info) => __awaiter(this, void 0, void 0, function* () {
            const registeredUser = yield User_1.User.findOne({ email, password });
            if (registeredUser) {
                throw new AuthenticationError("User already exists");
            }
            const newUser = new User_1.User(Object.assign({ firstname,
                lastname,
                phone,
                email, password: yield encryptPassword(password), city,
                country,
                postcode }, (isAdmin && { isAdmin })));
            try {
                const createdUser = yield newUser.save();
                const token = getToken({ email: createdUser.email });
                return Object.assign({}, createdUser, { token });
            }
            catch (error) {
                throw error;
            }
        }),
        login: (_, { email, password }, { req }) => __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email });
            const isMatch = yield comparePassword(password, user.password);
            if (isMatch) {
                const token = getToken({ email: user.email });
                return Object.assign({}, user, { token });
            }
            else {
                throw new AuthenticationError("Wrong login");
            }
        })
    }
};
//# sourceMappingURL=resolvers.js.map