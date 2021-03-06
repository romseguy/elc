import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "utils/useAuth";
import { createServerError } from "middlewares/errors";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getWorkshop(req, res) {
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
      const workshop = await req.models.Workshop.findOne({ _id: pid });

      if (workshop) {
        res.status(200).json({ data: workshop });
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

handler.put(async function updateWorkshop(req, res) {
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
      const { n, nModified } = await req.models.Workshop.updateOne(
        { _id: pid },
        req.body
      );

      if (nModified === 1) {
        res.status(200).json({ data: {} });
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

handler.delete(async function removeWorkshop(req, res) {
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
      const workshop = await req.models.Workshop.findOne({ _id: pid });
      const { deletedCount } = await req.models.Workshop.deleteOne({
        _id: pid
      });

      if (deletedCount === 1) {
        res.status(200).json({ data: workshop });
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
