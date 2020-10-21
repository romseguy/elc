import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { createServerError } from "middlewares/errors";
import { getSession } from "utils/useAuth";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getSkill(req, res) {
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
    const {
      query: { pid }
    } = req;

    try {
      const skill = await req.models.Skill.findOne({ _id: pid });

      if (skill) {
        res.status(200).json({ data: skill });
      } else {
        res
          .status(400)
          .json(
            createServerError(new Error("Le document n'a pas pu être trouvé"))
          );
      }
    } catch (error) {
      createServerError(error);
    }
  }
});

handler.put(async function updateSkill(req, res) {
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
    const {
      query: { pid }
    } = req;

    try {
      const { n, nModified } = await req.models.Skill.updateOne(
        { _id: pid },
        req.body
      );

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(new Error("Le document n'a pas pu être modifié"))
          );
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.delete(async function removeSkill(req, res) {
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
    const {
      query: { pid }
    } = req;

    try {
      // remove references to this skill from profiles
      const profiles = await req.models.Profile.find({});

      for (const profile of profiles) {
        if (Array.isArray(profile.skills)) {
          for (const skillRef of profile.skills) {
            if (skillRef.skill === pid) {
              await req.models.Profile.updateOne(
                { _id: profile._id },
                {
                  skills: profile.skills.filter(
                    (skillRef) => skillRef.skill !== pid
                  )
                }
              );
            }
          }
        }
      }

      const skill = await req.models.Skill.findOne({ _id: pid });
      const { deletedCount } = await req.models.Skill.deleteOne({ _id: pid });

      if (deletedCount === 1) {
        res.status(200).json({ data: skill });
      } else {
        res
          .status(400)
          .json(
            createServerError(new Error("Le document n'a pas pu être supprimé"))
          );
      }
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

export default handler;
