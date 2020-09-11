import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "next-auth/client";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    const {
      query: { pid },
    } = req;

    const collection = req.db.collection("children");
    const query = { _id: Number(pid) };
    const document = await collection.findOne(query);

    res.json({ data: document });

    // const cursor = await collection.find(query);

    // if ((await cursor.count()) === 0) {
    //   console.log("No documents found!");
    // }

    // await cursor.forEach(console.dir);
  }
});

export default handler;
