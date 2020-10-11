import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { createServerError, databaseErrorCodes } from "middlewares/errors";
import { getSession } from "utils/useAuth";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getParents(req, res) {
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
    const parents = await req.models.Parent.find({});
    res.status(200).json({ data: parents });
  } catch (error) {
    res.status(400).json(createServerError(error));
  }
  //}
});

handler.post(async function postParent(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    try {
      const { firstname, lastname, email, children } = req.body;
      const parent = await req.models.Parent.create({
        firstname,
        lastname,
        email,
        children
      });
      // add reference to the parent to his/her child's profile
      if (Array.isArray(children)) {
        for (const _id of children) {
          const childProfile = await req.models.Profile.findOne({ _id });
          childProfile.parents = childProfile.parents.concat([parent._id]);
          await childProfile.save();
        }
      }
      res.status(200).json({ data: parent });
    } catch (error) {
      if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
        res
          .status(400)
          .json({ email: "Un parent avec cette adresse email existe déjà" });
      } else {
        res.status(400).json(createServerError(error));
      }
    }
  }
});

export default handler;
