const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { commentIdUpdateTrigger } = require("./triggers/commentTriggers");
const {
  onUserDeleteAccount,
  updateUserProfile,
  onProfileChange,
} = require("./triggers/users/Users");
const {
  onPostLikes,
  onCommentOnPost,
  unLikeOnPost,
  onPostDelete,
} = require("./triggers/posts/posts");
const { endPoint } = require("./endpoint");
const { fileUploadScaled } = require("./helpers/imageUpload");
const app = express();
const fileupload= require("express-fileupload")
const bodyParser = require("body-parser")
app.use(fileupload())

app.use(cors({ origin: true }));

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true })); 

app.use("/auth", require("./Services/Authentication/controller"));

app.use("/user", require("./Services/User/controller"));

app.use("/posts", require("./Services/Posts/controller"));

app.post("/imageUploadScale",endPoint,fileUploadScaled)

app.post("upload",(req,res)=>{
  const file = req.files
  console.log(file)
})
 

exports.api = functions.https.onRequest(app);

exports.commentId = functions.firestore
  .document("COMMENT/{commentId}")
  .onCreate((snap, context) => {
    let { commentId } = context.params;
    commentIdUpdateTrigger(commentId);
  });

exports.onUserDelete = functions.firestore
  .document("USERS/{uid}")
  .onDelete((snap, context) => {
    onUserDeleteAccount(snap, context);
  });

// exports.onPostDelete = functions.firestore
// .document("POSTS/{postId}")
// .onDelete((snap, context) => {
//   onPostDelete(snap, context);
// });

//TODO:Trigger when the user likes post

exports.notificationOnLike = functions.firestore
  .document("POST-LIKES/{id}")
  .onCreate((snap, context) => {
    onPostLikes(snap);
  });

exports.notificationOnComment = functions.firestore
  .document("COMMENT/{id}")
  .onCreate((snap, context) => {
    onCommentOnPost(snap);
  });

exports.userNotificationsOnCommentLikes = functions.firestore
  .document("POST-LIKES/{id}")
  .onDelete((snap, context) => {
    unLikeOnPost(snap);
  });

exports.onUserUpdate = functions.firestore
  .document("USERS/{uid}")
  .onUpdate((snap, context) => {
    updateUserProfile(snap, context);
  });

exports.onPostDelete = functions.firestore
  .document("POSTS/{postId}")
  .onDelete((snap, context) => {
    onPostDelete(snap, context);
  });

exports.onUserPrifilePicChange = functions.firestore
  .document("USERS/{uid}")
  .onUpdate((snap, context) => {
    onProfileChange(snap);
  });
