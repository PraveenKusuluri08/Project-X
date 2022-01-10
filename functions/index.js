const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: true }));

app.use("/auth", require("./Services/Authentication/controller"));

app.use("/user", require("./Services/User/controller"));

app.use("/posts", require("./Services/Posts/controller"));
exports.api = functions.https.onRequest(app);
