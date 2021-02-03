"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
exports.User = mongoose.model('User', {
    firstname: String,
    lastname: String,
    phone: String,
    email: String,
    password: String,
    country: String,
    city: String,
    postcode: String,
    isAdmin: Boolean
});
//# sourceMappingURL=User.js.map