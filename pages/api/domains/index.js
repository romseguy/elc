import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { createServerError, databaseErrorCodes } from "middlewares/errors";
import { getSession } from "utils/useAuth";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getDomains(req, res) {
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
    const domains = await req.models.Domain.find({});
    res.status(200).json({ data: domains });
  } catch (error) {
    res.status(400).json(createServerError(error));
  }
  // }
});

handler.post(async function postDomain(req, res) {
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
      const domain = await req.models.Domain.create(req.body);
      res.status(200).json({ data: domain });
    } catch (error) {
      if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
        res
          .status(400)
          .json({ message: "Une matière avec ce libellé existe déjà" });
      } else {
        res.status(400).json(createServerError(error));
      }
    }
  }
});

export default handler;
