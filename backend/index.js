import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import connectMongo from 'connect-mongodb-session';
import session from 'express-session';

import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { expressMiddleware } from '@apollo/server/express4';
import passport from 'passport';
import { connectDB } from './db/connectDB.js';

import { buildContext } from 'graphql-passport';

import { configurePassport } from './passport/passport.config.js';
import mergedResolvers from './resolvers/index.js';
import mergedTypeDefs from './typeDefs/index.js';

dotenv.config();
configurePassport()

const app = express()
const httpServer = http.createServer(app)

const MongoDBStore = connectMongo(session)
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions'
})

store.on("error", (error) => console.log(error))

app.use(
    session(
        {
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            },
            store: store
        },
    )
)

app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await server.start();

app.use(
    '/',
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res })
    })
)

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve))
await connectDB()

console.log(`🚀 Sevrer running at http://localhost.4000/`);
