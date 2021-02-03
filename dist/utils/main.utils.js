var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = {
    secret: "secret"
};
const encryptPassword = (password) => new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error, salt) => {
        if (error) {
            reject(error);
            return false;
        }
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                reject(err);
                return false;
            }
            resolve(hash);
            return true;
        });
    });
});
const comparePassword = (password, hash) => new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
    try {
        const isMatch = yield bcrypt.compare(password, hash);
        resolve(isMatch);
        return true;
    }
    catch (err) {
        reject(err);
        return false;
    }
}));
const getToken = (payload) => {
    const token = jwt.sign(payload, config.secret, {
        expiresIn: 604800,
    });
    return token;
};
const getPayload = (token) => {
    try {
        const payload = jwt.verify(token, config.secret);
        return { loggedIn: true, payload };
    }
    catch (err) {
        return { loggedIn: false };
    }
};
module.exports = {
    getToken,
    getPayload,
    encryptPassword,
    comparePassword
};
//# sourceMappingURL=main.utils.js.map