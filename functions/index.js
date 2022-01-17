const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { commentIdUpdateTrigger } = require("./triggers/commentTriggers");
const {
  onUserDeleteAccount,
  updateUserProfile,
} = require("./triggers/users/Users");
const {
  onPostLikes,
  onCommentOnPost,
  unLikeOnPost,
  onPostDelete,
} = require("./triggers/posts/posts");
const app = express();

app.use(cors({ origin: true }));

app.use("/auth", require("./Services/Authentication/controller"));

app.use("/user", require("./Services/User/controller"));

app.use("/posts", require("./Services/Posts/controller"));

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
