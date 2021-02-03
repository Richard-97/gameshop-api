import { IUser } from "./interfaces/user.interface";
import { User } from "./models/User";

const { Game } = require("./models/Game");
const { Storage } = require('@google-cloud/storage')

const { GraphQLUpload } = require('apollo-upload-server');
const { AuthenticationError } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const {sign} = require("jsonwebtoken");
const { getToken, encryptPassword, comparePassword } = require("./utils/main.utils");

const gc = new Storage({
  keyFileName: path.join(__dirname, '../gamesshop-bf1925847484.json'),
  projectId: 'gamesshop'
});

export const resolvers = {
    Upload: GraphQLUpload,
    Query: {
      games: (_: any, args: any, context: any) => {
        const refresh_token = sign({userId: "123"}, "secret", {expiresIn: "7d"}, {
            maxAge: 60 * 60,
            sameSite: 'lax',
        })

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

        return Game.find()
      }
    },
    Mutation: {
        createGame: async (_: any, {title, type, price, image, video}: {title:string, type: string, price: string, image: any, video: string}, {res}: any) => {
          const GAMES_BUCKET = 'games-shop-bucket'
          const { createReadStream, filename } = await image;

          try{
            const stream = createReadStream();
            const myBucket = gc.bucket(GAMES_BUCKET);
            await stream.pipe(
              myBucket.file(filename).createWriteStream({
                resumamble: false,
                gzip: true
              })
            )
           
            const game = new Game({
              title, 
              type, 
              price, 
              image: `/${GAMES_BUCKET}/${filename}`, 
              video});
            await game.save();
            const games = Game.find()
            const refresh_token = sign({userId: "123"}, "secret", {expiresIn: "7d"})
            const access_token = sign({userId: "123"}, "secret", {expiresIn: "15min"})

            res.cookie('refresh-token', refresh_token, {expire: 60 * 60 * 24 * 7}) // 7 days
            res.cookie('access-token', access_token, {expire: 60 * 15}) // 15 mins
            return {response: "Game successfully saved", games}
          }
          catch(error){
            return {response: `Saving game failed-${error}`, games: []}
          }
          
        },
        register: async (_: any, {firstname, lastname, phone, email, password, city, country, postcode, isAdmin}: IUser , {req}: {req: any}, info: any) => {
          const registeredUser = await User.findOne({email, password});
          if(registeredUser){
            throw new AuthenticationError("User already exists");
          }
          const newUser = new User({
            firstname, 
            lastname, 
            phone, 
            email, 
            password: await encryptPassword(password), 
            city, 
            country, 
            postcode,
            ...(isAdmin && {isAdmin})
          });
          try{
            const createdUser = await newUser.save();
            const token = getToken({email: createdUser.email});
            return {...createdUser, token};
          }
          catch(error){
            throw error;
          }

        },
        login: async (_: any, {email, password}: {email: string, password: string}) => {
          const user = await User.findOne({ email });
          const isMatch = await comparePassword(password, user.password);
          if(isMatch){
            const token = getToken({ email: user.email });
            return {...user, token};
          }
          else{
            throw new AuthenticationError("Wrong login");
          }
        }
    }
};