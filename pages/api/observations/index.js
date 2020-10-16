import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { createServerError, databaseErrorCodes } from "middlewares/errors";
import { getSession } from "utils/useAuth";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getObservations(req, res) {
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
    const observations = await req.models.Observation.find({});
    res.json({ data: observations });
  } catch (error) {
    createServerError(error);
  }
  //}
});

handler.post(async function postObservation(req, res) {
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
      const observation = await req.models.Observation.create(req.body);
      res.status(200).json({ data: observation });
    } catch (error) {
      // if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
      //   res
      //     .status(400)
      //     .json({ code: "Une observation avec ce code existe déjà" });
      // } else {
      res.status(400).json(createServerError(error));
      // }
    }
  }
});

export default handler;
