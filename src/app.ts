const { ApolloServer } = require( 'apollo-server-express');
const {typeDefs} = require( './typeDefs');
const {resolvers} = require( './resolvers');
const express = require( 'express');
const cors = require( 'cors');
const path = require( 'path');
const bodyParser = require( 'body-parser');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");

const MONGO_CONNECTION = process.env.NODE_ENV_MONGODB_URL

const app = express();

export default (async function () {
  try {
    
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true})

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      // context: ({ req, res }: any) => {
      //   return {
      //     req, 
      //     res
      //   };
      // },
      plugins: [httpHeadersPlugin],
      context: ({ event, context, req }: any) => {
        return {
            event,
            context,
            setCookies: new Array(),
            setHeaders: new Array()
        };
    }
    });

    const corsConfig = {
      origin: '*',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    };

    dotenv.config();
    app.use(function (req: any, res: any, next: any) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
        next();
  });
  app.use(cors(corsConfig));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use('/images', express.static(path.join(__dirname, 'images')));

    const dir = path.join(process.cwd(), 'images');
    app.use(express.static(dir));
    app.use(express.static('public'))
    app.use(express.static('files'))
    
    server.applyMiddleware({ app, cors: false });
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    )
  } catch (err) {
    console.error(err);
  }
})();