const mongoose = require('mongoose');

export const User = mongoose.model('User', {
    firstname: String!,
    lastname: String!,
    phone: String!,
    email: String!,
    password: String!,
    country: String!,
    city: String!,
    postcode: String!,
    isAdmin: Boolean
  })