import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { createServerError } from "middlewares/errors";
import { getSession } from "utils/useAuth";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getSkills(req, res) {
  const session = await getSession({ req });

  // if (!session) {
  //   res
  //     .status(403)
  //     .json(
  //       createServerError(
  //         new Error("Vous devez être identifié pour accéder à ce contenu.")
  //       )
  //     );
  // } else {
  try {
    const skills = await req.models.Skill.find({});
    res.json({ data: skills });
  } catch (error) {
    createServerError(error);
  }
  //}
});

handler.post(async function postSkill(req, res) {
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
      const skill = await req.models.Skill.create(req.body);
      res.status(200).json({ data: skill });
    } catch (error) {
      if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
        res
          .status(400)
          .json({ name: "Une compétence avec ce code existe déjà" });
      } else {
        res.status(400).json(createServerError(error));
      }
    }
  }
});

export default handler;
