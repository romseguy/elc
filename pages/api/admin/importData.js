import nextConnect from "next-connect";
import middleware from "middlewares/database";
import { createServerError, databaseErrorCodes } from "middlewares/errors";
import { getSession } from "utils/useAuth";
import multer from "multer";

const handler = nextConnect();

handler.use(middleware);

// configure multer for file upload
// store uploaded image on temporary directory of serverless function
// const upload = multer({ dest: "/tmp" });
const upload = multer({ dest: "/tmp" }).single("file");
// handler.use(upload.single("file"));

handler.post(async function importData(req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.log("1");
    } else if (err) {
      // An unknown error occurred when uploading.
      console.log("2");
    }

    // Everything went fine.
    console.log("3");
    console.log(req.file);
  });

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
    // console.log(req.headers);
    // console.log(req.body);
    res.status(200).json({ data: "yo" });
  } catch (error) {
    res.status(400).json(createServerError(error));
  }
  // }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
