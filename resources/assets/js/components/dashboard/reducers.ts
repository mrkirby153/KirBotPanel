import {combineReducers} from "redux";
import appReducer from './reducer';
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {RootStore} from "./types";

const staticReducers: object = {
    app: appReducer
};

export const useTypedSelector: TypedUseSelectorHook<RootStore> = useSelector;

export default function makeReducers(dynamicReducers: object = {}) {
    return combineReducers({
        ...staticReducers,
        ...dynamicReducers
    })
}