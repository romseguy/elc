import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { createServerError } from "middlewares/errors";
import { getSession } from "utils/useAuth";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getObservation(req, res) {
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
      const observation = await req.models.Observation.findOne({ _id: pid });

      if (observation) {
        res.status(200).json({ data: observation });
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

handler.put(async function updateObservation(req, res) {
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
      const { n, nModified } = await req.models.Observation.updateOne(
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

handler.delete(async function removeObservation(req, res) {
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
      // remove references to this observation from profiles
      const profiles = await req.models.Profile.find({});

      for (const profile of profiles) {
        if (Array.isArray(profile.observations)) {
          for (const observationRef of profile.observations) {
            if (observationRef.observation === pid) {
              await req.models.Profile.updateOne(
                { _id: profile._id },
                {
                  observations: profile.observations.filter(
                    (observationRef) => observationRef.observation !== pid
                  )
                }
              );
            }
          }
        }
      }
      const observation = await req.models.Observation.findOne({ _id: pid });
      const { deletedCount } = await req.models.Observation.deleteOne({
        _id: pid
      });

      if (deletedCount === 1) {
        res.status(200).json({ data: observation });
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
