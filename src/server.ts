require("dotenv").config();

import { IncomingMessage } from "http";
import * as mongoose from "mongoose";
import { contextController } from "./controllers/context";
import exSchema from "./schemas/allSchemas";

import Koa = require("koa");
const { ApolloServer } = require("apollo-server-koa");

const PORT = process.env.PORT;

const mongoUrl: string = process.env.MONGO_URL;

mongoose.set("debug", true);
mongoose.set("useFindAndModify", false); // ojo con esto al desplegar
mongoose.connect(
  mongoUrl,
  { useNewUrlParser: true, useCreateIndex: true },
  (err: any) =>{
    if (err) {throw err; }

    console.log("Successfully connected to Mongo");
  },
);

interface IContext { ctx: IncomingMessage; }

const server = new ApolloServer({
  context: async ({ ctx }: IContext) => {
    console.log(ctx);
    const user = await contextController.getMyUser(ctx);
    return { user }; //  add the user to the ctx
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
    "🚀 Server ready at " + process.env.SERVER_URL + PORT + "/graphql",
  ),
);
