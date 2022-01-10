const router = require("express").Router();
const { endPoint, getIdToken } = require("../../endpoint");
const { checkCreatePost } = require("../../helpers/utils");
const Posts = require("./model");
router.get("/getallposts", endPoint, (req, res) => {
  const obj = new Posts(req.user);
  try {
    obj.getAllPosts().then((data) => {
      console.log(data);
      return res.status(200).json(data);
    });
  } catch (err) {
    console.log(err);
  }
});

// router.get("/getsinglepost", endPoint, (req, res) => {
//   const obj = new Posts(req.user);
//   const { id } = req.query;
//   obj
//     .getSinglePost(id)
//     .then(() => {
//       return res.status(200).json({});
//     })
//     .catch((err) => {
//       return res.status(500).json({ err: err });
//     });
// });

router.post("/createpost", getIdToken, (req, res) => {
  const obj = new Posts(req.user);
  console.log(req.user);
  if (req.body.post.trim() === "") {
    return res
      .status(404)
      .json({ message: "Content body is missing! Please fill the body" });
  }
  obj
    .createPost(req.body)
    .then(() => {
      return res.status(202).json({ message: "Post created successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ message: "failed to create post" });
    });
});

router.get("/getpostwithcomment", endPoint, (req, res) => {
  const { postId } = req.query;
  const obj = new Posts(req.user);
  obj
    ._getPostWithComments(postId)
    .then((resData) => {
      return res.status(200).json(resData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({
        error: "Requested post is not exist! Please try again different post",
      });
    });
});

router.post("/:postId/commentOnPost", getIdToken, (req, res) => {
  const inputs = req.body;
  const { postId } = req.params;
  const obj = new Posts(req.user);
  obj
    ._do_Comment(inputs, postId)
    .then((responce) => {
      console.log(responce)
      return res.status(202).json({ message: "Commented successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ error: err });
    });
});



module.exports = router;
