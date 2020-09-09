import nextConnect from "next-connect";
import middleware from "middlewares/database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  let doc = await req.db.collection("users").findOne();
  res.json(doc);
});

export default handler;
