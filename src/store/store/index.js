import rootReducers from "../reducers/index"
import {createStore,applyMiddleware} from "redux"
import thunk from "redux-thunk"
import {getFirebase } from "react-redux-firebase"
import { composeWithDevTools } from "redux-devtools-extension"
const store = createStore(
    rootReducers,
    composeWithDevTools(
        applyMiddleware(thunk.withExtraArgument({getFirebase}))
    )
)

export default store