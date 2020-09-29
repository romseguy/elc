import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "next-auth/client";
import { createServerError } from "utils/api/errors";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getWorkshops(req, res) {
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
      const workshops = await req.models.Workshop.find({});
      res.json({ data: workshops });
    } catch (error) {
      createServerError(error);
    }
  }
});

handler.post(async function postWorkshop(req, res) {
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
      const workshop = await req.models.Workshop.create(req.body);
      res.status(200).json({ data: workshop });
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

export default handler;
