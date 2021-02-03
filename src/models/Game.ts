const mongoose = require('mongoose');

export const Game = mongoose.model('Game', {
    title: String!,
    type: [String!]!,
    price: String!,
    image: String!,
    video: String
  })