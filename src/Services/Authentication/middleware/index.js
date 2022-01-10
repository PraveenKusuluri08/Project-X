import {
  signInRequest,
  signInSuccess,
  signInFailure,
  signoutRequest,
  signoutSuccess,
  signoutFailure,
} from "../actions/actionCreators";
import firebase from "../../../fbConfig/fbconfig";
import axios from "axios";
import { API } from "../../../fbConfig/API";

export const onLogin = (creds) => {
  return (dispatch, getState, { getFirebase }) => {
    dispatch(signInRequest());
    firebase
      .auth()
      .signInWithEmailAndPassword(creds.email, creds.password)
      .then(({ user }) => {
        console.log(user);
        dispatch(signInSuccess(user));
        return user.getIdToken();
      })
      .then((idToken) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;
        axios.defaults.baseURL = API;
        return;
      })
      .catch((err) => {
        console.log(err);
        if (
          err.code === "auth/wrong-password" ||
          err.code === "auth/user-not-found"
        )
          alert("Incorrect email or password.");
        else alert(err.message);
        dispatch(signInFailure());
      });
  };
};

export const onSignout = () => {
  return (dispatch, getState, { getFirebase }) => {
    dispatch(signoutRequest());
    return firebase
      .auth()
      .signOut()
      .then((res) => {
        console.log("res",res)
        dispatch(signoutSuccess());
      })
      .catch((err) => {
        console.log(err);
        dispatch(signoutFailure());
      });
  };
};

//TODO:auth/network-request-failed handle network errors and serve some smart and fun content until the network backs
