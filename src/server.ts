require('dotenv').config();

import exSchema from './schemas/allSchemas';
import * as mongoose from 'mongoose';
import { contextController } from './controllers/context';
const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');

const PORT = process.env.PORT;

const mongoUrl = process.env.MONGO_URL;

mongoose.set('debug', true);
mongoose.set('useFindAndModify', false); //ojo con esto al desplegar
mongoose.connect(
  mongoUrl,
  { useNewUrlParser: true, useCreateIndex: true },
  function(err: any) {
    if (err) throw err;

    console.log('Successfully connected to Mongo');
  },
);

const server = new ApolloServer({
  context: async ({ ctx }) => {
    const user = await contextController.getMyUser(ctx);
    return { user }; // add the user to the ctx
  },
  schema: exSchema,
  upload: {
    maxFileSize: 10000000,
    maxFiles: 20,
  },
});

const app = new Koa();

server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log(
    '🚀 Server ready at ' + process.env.SERVER_URL + PORT + '/graphql',
  ),
);
