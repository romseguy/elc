import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "utils/useAuth";
import { createServerError } from "middlewares/errors";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getProfile(req, res) {
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
      const profile = await req.models.Profile.findOne({ _id: pid });

      if (profile) {
        res.status(200).json({ data: profile });
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

handler.put(async function updateProfile(req, res) {
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
      const { n, nModified } = await req.models.Profile.updateOne(
        { _id: pid },
        req.body
      );

      if (nModified === 1) {
        res
          .status(200)
          .json({ data: await req.models.Profile.findOne({ _id: pid }) });
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

handler.delete(async function removeProfile(req, res) {
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
      // remove references to this profile from parents' children
      const parents = await req.models.Parent.find({});

      for (const parent of parents) {
        if (Array.isArray(parent.children)) {
          for (const profileId of parent.children) {
            if (profileId === pid) {
              await req.models.Parent.updateOne(
                {
                  _id: parent._id
                },
                {
                  children: parent.children.filter(
                    (profileId) => profileId !== pid
                  )
                }
              );
            }
          }
        }
      }

      const profile = await req.models.Profile.findOne({ _id: pid });
      const { deletedCount } = await req.models.Profile.deleteOne({ _id: pid });

      if (deletedCount === 1) {
        res.status(200).json({ data: profile });
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
