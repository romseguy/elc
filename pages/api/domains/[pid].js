import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "utils/useAuth";
import { createServerError } from "middlewares/errors";

const handler = nextConnect();

handler.use(middleware);

handler.delete(async function removeDomain(req, res) {
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
      const domain = await req.models.Domain.findOne({ _id: pid });
      const { deletedCount } = await req.models.Domain.deleteOne({ _id: pid });

      if (deletedCount === 1) {
        res.status(200).json({ data: domain });
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
