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
    try {
      const skills = await req.models.Skill.find({});
      res.json({ data: skills });
    } catch (error) {
      createServerError(error);
    }
  }
});

handler.post(async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    try {
      const skill = await req.models.Skill.create(req.body);
      res.status(200).json(skill);
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

export default handler;
