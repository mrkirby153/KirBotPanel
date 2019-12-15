import {combineReducers} from "redux";
import appReducer from './reducer';

const staticReducers: object = {
    app: appReducer
};

export default function makeReducers(dynamicReducers: object = {}) {
    return combineReducers({
        ...staticReducers,
        ...dynamicReducers
    })
}