var admin = require("firebase-admin");

var serviceAccount = require("./admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://socialapp-f14f0-default-rtdb.firebaseio.com",
  storageBucket: "gs://socialapp-f14f0.appspot.com"
});

const db = admin.firestore()
const storage = admin.storage()

module.exports={db,admin,storage}