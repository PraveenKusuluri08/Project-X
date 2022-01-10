import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./store/store/index";
import { ReactReduxFirebaseProvider, isLoaded } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import firebase from "./fbConfig/fbconfig";
// import { ErrorBoundary } from "react-error-boundary";
import { API } from "./fbConfig/API";
import axios from "axios";
import { Provider, useSelector } from "react-redux";
import {Loader} from "./Pages/Loader"
const profileSpecificProps = {
  userProfile: "USERS",
  useFirestoreForProfile: true,
  enableRedirectHandling: false,
  resetBeforeLogin: false,
};

const rffProps = {
  firebase,
  config: { ...profileSpecificProps },
  dispatch: store.dispatch,
  createFirestoreInstance,
};

function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => state.firebase.auth);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      user
        .getIdToken()
        .then((token) => {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          axios.defaults.baseURL = API;
          return;
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  });
  if (!isLoaded(auth)) return <Loader/>
  return children;
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rffProps}>
      <AuthIsLoaded>
        <App />
      </AuthIsLoaded>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
