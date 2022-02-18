const Model = require("./model");
const router = require("express").Router();
const {
  validationCreateUser,
  checkUpdateFieldsIsEmpty,
} = require("../../helpers/utils");
const { endPoint } = require("../../endpoint");
const {uploadImage, fileUploadScaled} = require("../../helpers/imageUpload");

//signUp

// role will automatically send 1 as user for all profiles

router.post("/createuser", (req, res) => {
  const inputs = {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    isExists: req.body.isExists,
    name: req.body.name,
  };
  const obj = new Model();
  const { err, valid } = validationCreateUser(inputs);
  if (!valid) return res.status(404).json(err);
  obj
    ._create_user(inputs)
    .then(() => {
      return res.status(202).json({ message: "User created successfully" });
    })
    .catch((error) => {
      if (error.code === "auth/email-already-exists") {
        return res.status(400).json({ message: `User already exists` });
      }
      if (error.code === "auth/invalid-email") {
        return res.status(400).json({ error: `Email address is invalid` });
      }
      if (error.code === "auth/invalid-password") {
        return res
          .status(400)
          .json({ error: `Password is invalid!! not 6 characters` });
      }
      console.error(error);
      return res.status(400).json({ error: `Failed to create user` });
    });
});

//upload image

router.post("/user/uploadimage", endPoint, uploadImage);

//TODO:Scalable image upload to the storage trils
router.post("/user/uploadimagescale",endPoint,fileUploadScaled)

router.delete("/user/deleteaccount", endPoint, async (req, res) => {

  const obj = new Model(req.user);
  try {
    let authDelete = await obj._deleteUserAccount();
    console.log(authDelete);
    return res.status(200).json({message:authDelete });
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
});

module.exports = router;
