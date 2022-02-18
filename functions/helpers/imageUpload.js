const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { storage, db } = require("../utils/admin");
const AuthUtils = require("../Services/Authentication/utils");
const fileupload = require("express-fileupload");

const uploadImage = async (req, res) => {
  let userExists = await AuthUtils._userExists(req.user.uid);
  console.log(userExists);
  if (userExists.isExists === true) {
    const busboy = BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded;

    busboy.on("file", (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;
      if (
        mimeType !== "image/jpeg" &&
        mimeType !== "image/png" &&
        mimeType !== "jpg"
      ) {
        return res.status(404).json({
          message: "File type not accepted submit only 'png/jpeg/jpg'",
        });
      }

      //get the extension of the image
      const imageExtension =
        filename.split(".")[filename.split(".").length - 1];

      //for getting the random file name for to store in the db
      imageFileName = `${Math.round(
        Math.random() * 1000000
      )}.${imageExtension}`;

      const filePath = path.join(os.tmpdir(), imageFileName);

      imageToBeUploaded = { filePath, mimeType };
      console.log("mimetype", mimeType);
      file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on("finish", () => {
      storage
        .bucket()
        .upload(imageToBeUploaded.filePath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToBeUploaded.mimeType,
            },
          },
        })
        .then(() => {
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/socialapp-f14f0.appspot.com/o/${imageFileName}?alt=media`;
          return db
            .collection("USERS")
            .doc(req.user.uid)
            .update({ imageUrl })
            .then(() => {
              return res.json({ message: "Image uploaded successfully!!" });
            });
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    });
    busboy.end(req.rawBody);
  } else {
    return res.status(404).json({ error: "Can't upload image" });
  }
};

const fileUploadScaled = async (req, res) => {
  let userExists = await AuthUtils._userExists(req.user.uid);
  console.log(req.files)
  const file = req.files.file;

  if (userExists.isExists === true) {
    let imageFileName;
    let imageToBeUploaded;
    let imageExtension = file.name.split(".")[1];
    imageFileName = `${Math.round(Math.random() * 1000000)}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    let mimtype = file.mimetype;
    imageToBeUploaded = { filePath, mimtype };

    return storage
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimeType,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/socialapp-f14f0.appspot.com/o/${imageFileName}?alt=media`;
        return db
          .collection("USERS")
          .doc(req.user.uid)
          .update({ imageUrl })
          .then(() => {
            return res.json({ message: "Image uploaded successfully!!" });
          });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } else {
    return await res.status(404).json("Cant Upload image");
  }
};
module.exports = {uploadImage,fileUploadScaled};
