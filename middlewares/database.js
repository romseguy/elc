// import { MongoClient } from "mongodb";
// const client = new MongoClient(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
import nextConnect from "next-connect";
import mongoose from "mongoose";
import {
  ParentSchema,
  ProfileSchema,
  SkillSchema,
  WorkshopSchema
} from "utils/mongoose/schemas";

const middleware = nextConnect();
const connection = mongoose.createConnection(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  // bufferCommands: false,
  // bufferMaxEntries: 0,
  useFindAndModify: false,
  useUnifiedTopology: true
});
const client = connection.client;

middleware.use(async (req, res, next) => {
  if (!client.isConnected()) await client.connect();

  req.dbClient = client;
  req.db = client.db();
  req.models = {
    Parent: connection.model("Parent", ParentSchema),
    Profile: connection.model("Profile", ProfileSchema),
    Skill: connection.model("Skill", SkillSchema),
    Workshop: connection.model("Workshop", WorkshopSchema)
  };

  return next();
});

export default middleware;
