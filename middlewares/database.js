// import { MongoClient } from "mongodb";
// const client = new MongoClient(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
import nextConnect from "next-connect";
import mongoose from "mongoose";
import * as Schemas from "utils/mongoose/schemas";

let connection = null;
const middleware = nextConnect();

middleware.use(async (req, res, next) => {
  if (!connection) {
    connection = await mongoose.createConnection(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  }

  if (!connection.client.isConnected()) await connection.client.connect();

  const models = {};
  Object.keys(Schemas).forEach(
    (key) => (models[key] = connection.model(key, Schemas[key]))
  );
  req.models = models;

  return next();
});

export default middleware;
