const BusBoy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const { storage, db } = require("../utils/admin");

const uploadImage = (req, res) => {
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
      return res.status(404).json({ message: "Wrong file type submited" });
    }

    //get the extension of the image
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    //for getting the randon file name for to store in the db
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
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/fir-realworld-d5b34.appspot.com/o/${imageFileName}?alt=media`;
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
};
module.exports = uploadImage;
