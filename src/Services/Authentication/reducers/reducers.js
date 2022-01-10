import { Actions } from "../actions/actionTypes";
import { initState } from "./initialState";

export const reducers = (state = initState, { type, payload }) => {
  switch (type) {
    case Actions.SIGNIN_REQUEST:
      return {
        ...state,
        loading: true,
        isError: false,
      };
    case Actions.SIGNIN_SUCCESS:
      return {
        ...state,
        data: payload,
      };
    case Actions.SIGNIN_FAILURE:
      return {
        ...state,
        isError: payload,
      };
      default: return state
  }
};
