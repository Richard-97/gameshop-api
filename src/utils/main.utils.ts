const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = {
    secret: "secret"
}

const encryptPassword = (password: string) => new Promise((resolve, reject) => {
	bcrypt.genSalt(10, (error: Error, salt: any) => {
		if (error) {
			reject(error)
			return false
		}
		bcrypt.hash(password, salt, (err: any, hash: any) => {
			if (err) {
				reject(err)
				return false
			}
			resolve(hash)
			return true
		})
	})
});

const comparePassword = (password: string, hash: string) => new Promise(async (resolve, reject) => {
	try {
		const isMatch = await bcrypt.compare(password, hash)
		resolve(isMatch)
		return true
	} catch (err) {
		reject(err)
		return false
	}
});

const getToken = (payload: any) => {
    const token = jwt.sign(payload, config.secret, {
        expiresIn: 604800, // 1 Week
    })
    return token
}

const getPayload = (token: any) => {
    try {
        const payload = jwt.verify(token, config.secret);
        return { loggedIn: true, payload };
    } catch (err) {
        return { loggedIn: false }
    }
}

module.exports = {
    getToken,
    getPayload,
    encryptPassword,
    comparePassword
}