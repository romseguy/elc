import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "next-auth/client";
import { createServerError } from "middlewares/errors";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getParent(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    const {
      query: { pid },
    } = req;

    try {
      const parent = await req.models.Parent.findOne({ _id: pid });

      if (parent) {
        res.json({ data: parent });
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

handler.put(async function editParent(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    const {
      query: { pid },
    } = req;

    try {
      const { n, nModified } = await req.models.Parent.updateOne(
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

handler.delete(async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    const {
      query: { pid },
    } = req;

    try {
      const { deletedCount } = await req.models.Parent.deleteOne({ _id: pid });

      if (deletedCount === 1) {
        res.status(200);
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
