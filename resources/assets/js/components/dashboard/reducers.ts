import {combineReducers} from "redux";
import appReducer from './reducer';

const staticReducers = {
    app: appReducer
};

export default function makeReducers(dynamicReducers = {}) {
    // @ts-ignore
    return combineReducers({
        ...staticReducers,
        ...dynamicReducers
    })
}