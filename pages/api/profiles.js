import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "next-auth/client";
import { handleError } from "utils/mongoose";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    try {
      const profiles = await req.models.Profile.find({});
      res.json({ data: profiles });
    } catch (error) {
      handleError(error);
    }
  }
});

handler.post(async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    try {
      const { firstname, lastname, birthdate } = req.body;
      const profile = await req.models.Profile.create({
        firstname,
        lastname,
        birthdate,
      });
      res.status(200).json(profile);
    } catch (error) {
      res.status(400).json(handleError(error));
    }
  }
});

export default handler;
