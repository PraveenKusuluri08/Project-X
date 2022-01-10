import authReducers from "../../Services/Authentication/reducers/index";

import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import {firestoreReducer} from "redux-firestore"
const rootReducers = combineReducers({
  firestore: firestoreReducer,
  firebase: firebaseReducer,
  authentication: authReducers,
});

export default rootReducers;
