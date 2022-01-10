import { Actions } from "./actionTypes";

export const signInRequest = () => {
  return {
    type: Actions.SIGNIN_REQUEST,
  };
};

export const signInSuccess = (payload) => {
  return {
    type: Actions.SIGNIN_SUCCESS,
    payload,
  };
};

export const signInFailure = (payload) => {
  return {
    type: Actions.SIGNIN_FAILURE,
    payload,
  };
};

export const signoutRequest = () => {
  return {
    type: Actions.SIGNOUT_REQUEST,
  };
};
export const signoutSuccess = () => {
  return {
    type: Actions.SIGNOUT_SUCCESS,
  };
};
export const signoutFailure = () => {
  return {
    type: Actions.SIGNOUT_FAILURE,
  };
};
