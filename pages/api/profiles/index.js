import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "next-auth/client";
import { createServerError } from "utils/api/errors";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getProfiles(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const profiles = await req.models.Profile.find({});
      res.status(200).json({ data: profiles });
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.post(async function postProfile(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const { firstname, lastname, birthdate } = req.body;
      const profile = await req.models.Profile.create({
        firstname,
        lastname,
        birthdate,
      });
      res.status(200).json({ data: profile });
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

export default handler;
