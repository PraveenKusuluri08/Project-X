import {reducers} from "./reducers"
import {combineReducers}from "redux"

const authReducers = combineReducers({
    authSignIn:reducers
})

export default authReducers