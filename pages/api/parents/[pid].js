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

handler.put(async function updateParent(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.send({ error: "Vous devez être identifié pour accéder à ce contenu." });
  } else {
    try {
      const {
        query: { pid }
        // body: { children }
      } = req;

      if (Array.isArray(req.body.children)) {
        if (!req.body.children.length) {
          // children have been removed from parent
          // => remove parents from children
          const parent = await req.models.Parent.findOne({ _id: pid });

          for (const childId of parent.children) {
            const childProfile = await req.models.Profile.findOne({
              _id: childId
            });

            childProfile.parents = childProfile.parents.filter((parentId) => {
              if (parentId === pid) return false;
              return true;
            });

            await childProfile.save();
          }
        } else {
          for (const _id of req.body.children) {
            const childProfile = await req.models.Profile.findOne({ _id });

            if (childProfile.parents.indexOf(pid) === -1) {
              childProfile.parents = childProfile.parents.concat([pid]);
            }

            await childProfile.save();
          }
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
