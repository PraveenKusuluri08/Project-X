const router = require("express").Router();
const { endPoint, getIdToken } = require("../../endpoint");
const User = require("./model");

router.put("/updateuser", endPoint, (req, res) => {
  //maintain last update details by that we can monitor the user login status
  //and last login data to minitor the user status
  const inputsData = req.body;
  const obj = new User(req.user);
  const { uid } = req.query;
  return obj
    .updateUserProfile(inputsData, uid)
    .then(() => {
      return res
        .status(200)
        .json({ message: "User Profile updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ message: err });
    });
});

router.get("/getauthdata", endPoint, (req, res) => {
  const obj = new User(req.user);
  obj
    .getAuthUserData()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: err });
    });
});

//TODO:Add the condition for delete if the image is cover.jpg then image need not to be deleted
//TODO:if the image is not cover.jpg delete that image and add default image the user with the help of trigger

router.delete("/deleteprofilepic", getIdToken, (req, res) => {
  const obj = new User(req.user);
  const { imageUrl } = req.query;
  obj
    .deleteProfilePic(imageUrl)
    .then(() => {
      return res.status(200).json({
        message: "Profile pic deleted successfully!! Default image is loaded",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Failed to delete profile pic" });
    });
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;

  const obj = new User();
  obj
    .getSeeTheUsersDataPublic(email)
    .then((data) => {
      console.log(data);
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

module.exports = router;
