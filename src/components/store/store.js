// Application Level Store

import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducer";

// Combine all reducers
const rootReducer = combineReducers({
    appReducer: appReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;