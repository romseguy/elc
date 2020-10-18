import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { getSession } from "utils/useAuth";
import { createServerError } from "middlewares/errors";

const handler = nextConnect();

handler.use(middleware);

handler.get(async function getParent(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    const {
      query: { pid }
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
    try {
      const {
        query: { pid },
        body: { children }
      } = req;

      if (Array.isArray(children)) {
        for (const _id of children) {
          const childProfile = await req.models.Profile.findOne({ _id });
          childProfile.parents = childProfile.parents.concat([pid]);
          await childProfile.save();
        }
      }

      const { n, nModified } = await req.models.Parent.updateOne(
        { _id: pid },
        req.body
      );

      if (nModified === 1) {
        res.status(200).json(req.body);
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

handler.delete(async function removeParent(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    const {
      query: { pid }
    } = req;

    try {
      // remove references to this parent from her/his children' profiles
      const profiles = await req.models.Profile.find({});

      for (const profile of profiles) {
        if (Array.isArray(profile.parents)) {
          for (const parentId of profile.parents) {
            if (parentId === pid) {
              await req.models.Profile.updateOne(
                { _id: profile._id },
                {
                  parents: profile.parents.filter(
                    (parentId) => parentId !== pid
                  )
                }
              );
            }
          }
        }
      }

      const parent = await req.models.Parent.findOne({ _id: pid });
      const { deletedCount } = await req.models.Parent.deleteOne({ _id: pid });

      if (deletedCount === 1) {
        res.status(200).json({ data: parent });
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
