import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "next-auth/client";
import { createServerError } from "utils/mongoose";

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

    try {
      const profile = await req.models.Profile.findOne({ _id: pid });
      res.json({ data: profile });
    } catch (error) {
      createServerError(error);
    }
  }
});

export default handler;
