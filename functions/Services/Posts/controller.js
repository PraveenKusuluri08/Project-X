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
    .then((post) => {
      console.log("post", post);
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
      console.log(responce);
      return res.status(202).json({ message: "Commented successfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ error: err });
    });
});

router.post("/likeonpost", getIdToken, async (req, res) => {
  const { postId } = req.query;
  const obj = new Posts(req.user);
  try {
    let likes = await obj._like_On_Post(postId);
    return res.status(200).json(likes);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error });
  }
});

router.post("/likeoncomment", getIdToken, async (req, res) => {
  const { commentId } = req.query;
  const obj = new Posts(req.user);
  try {
    let commentLikes = await obj._like_On_Comment(commentId);
    return res.status(200).json({ message: commentLikes });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
});

router.post("/unlikeonpost", getIdToken, async (req, res) => {
  const { postId } = req.query;
  const obj = new Posts(req.user);
  try {
    let unlikes = await obj._un_like_post(postId)
    return res.status(200).json(unlikes);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
});
router.post("/unlikeoncomment", getIdToken, async (req, res) => {
  const { commentId } = req.query;
  const obj = new Posts(req.user);
  try {
    let unlikes = await obj._un_like_comment(commentId)
    return res.status(200).json(unlikes);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ error: err });
  }
});

router.delete("/deletepost",endPoint, async(req, res)=>{
  const obj = new Posts(req.user)
  const {postId}= req.query
  try{
    let deletePost=await obj._delete_post(postId)
    return res.status(200).json(deletePost)
  }catch(err){
    console.log(err)
    return res.status(404).json({err})
  }
})


module.exports = router;
