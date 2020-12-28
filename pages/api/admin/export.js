import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { createServerError, databaseErrorCodes } from "middlewares/errors";
import { getSession } from "utils/useAuth";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function exportData(req, res) {
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
      const data = {};
      const keys = Object.keys(req.models);

      for (const key of keys) {
        const model = req.models[key];
        data[key] = await model.find({});
      }

      res.status(200).json({ data });
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

export default handler;
