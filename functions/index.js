const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const {commentIdUpdateTrigger}= require("./triggers/commentTriggers")
const app = express();

app.use(cors({ origin: true }));

app.use("/auth", require("./Services/Authentication/controller"));

app.use("/user", require("./Services/User/controller"));

app.use("/posts", require("./Services/Posts/controller"));

exports.api = functions.https.onRequest(app);

exports.commentId = functions.firestore
  .document("COMMENT/{commentId}")
  .onCreate((snap, context) => {
    let {commentId} = context.params
    commentIdUpdateTrigger(commentId)
  });
