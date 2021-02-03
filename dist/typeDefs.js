"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { gql } = require("apollo-server-core");
exports.typeDefs = gql `
    type Response {
        response: String!
        games: [Game]
    }
    type Game {
        id: ID
        title: String
        type: [String]
        price: String
        image: String
        video: String
    }
    type User {
        id: ID
        firstname: String
        lastname: String
        phone: String
        email: String
        password: String
        country: String
        city: String
        postcode: String
        isAdmin: Boolean
        token: String
    }
    type Query {
        games: [Game]!
    }
    
    type Mutation {
        createGame(title: String!, type: String!, price: String!, image: Upload!,video: String): Response!,
        register(firstname: String!, lastname: String!, phone: String!, email: String!, password: String!, country: String!, city: String!, postcode: String!, isAdmin: Boolean): User!,
        login(email: String!, password: String): User!
    }
`;
//# sourceMappingURL=typeDefs.js.map