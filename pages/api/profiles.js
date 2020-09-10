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
    const doc = await req.db.collection("children").find();
    const children = await doc.toArray();
    res.json({ data: children });
  }
});

handler.post(async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour modifier ce contenu." });
  } else {
    // let doc = await req.db.collection("children").insert({firstname: "Romain", lastname:"Séguy", birthday: new Date("Apr 4, 1990")})
    // res.json(doc)
  }
});

export default handler;
