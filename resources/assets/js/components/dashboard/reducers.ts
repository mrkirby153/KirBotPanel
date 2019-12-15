import {combineReducers} from "redux";

const staticReducers = {};

export default function makeReducers(dynamicReducers = {}) {
    return combineReducers({
        ...staticReducers,
        ...dynamicReducers
    })
}