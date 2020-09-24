import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "next-auth/client";
import { createServerError } from "utils/mongoose";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getParents(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    try {
      const parents = await req.models.Parent.find({});
      res.json({ data: parents });
    } catch (error) {
      createServerError(error);
    }
  }
});

handler.post(async function postParent(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    try {
      const { firstname, lastname, email } = req.body;
      const parent = await req.models.Parent.create({
        firstname,
        lastname,
        email,
      });
      res.status(200).json(parent);
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

export default handler;
