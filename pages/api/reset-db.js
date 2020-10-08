import nextConnect from "next-connect";
import middleware from "middlewares/database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function resetDb(req, res) {
  if (!process.env.NEXT_PUBLIC_IS_TEST) {
    res.status(400).send("Bad Request");
    return;
  }

  try {
    await req.db.dropDatabase();
    res.status(200).send("Database dropped");
  } catch (error) {
    console.error(error);
  }
});

export default handler;
