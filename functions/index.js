const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { commentIdUpdateTrigger } = require("./triggers/commentTriggers");
const { onUserDeleteAccount } = require("./triggers/users/Users");
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
    onUserDeleteAccount(snap,context)
  });

//TODO:A trigger to delete automatically all the post likes comment likes when post deleted

// exports.deleteLikesOnPostDelete= functions.firestore

//TODO: HardDelete if users deletes their account delete their images stored in storage
