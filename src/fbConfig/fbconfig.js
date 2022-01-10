import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import config from "./config"
const app = firebase.initializeApp(config);

firebase.firestore().settings({ timestampsInSnapshots: true });

export const auth = firebase.auth();
export const db = firebase.firestore();

export default app;
