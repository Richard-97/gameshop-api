"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
exports.Game = mongoose.model('Game', {
    title: String,
    type: [String],
    price: String,
    image: String,
    video: String
});
//# sourceMappingURL=Game.js.map