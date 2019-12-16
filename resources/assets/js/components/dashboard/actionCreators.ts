import {GET_USER} from "./actions";
import {GetUserAction} from "./reducer";
import {action} from "typesafe-actions";

export const getUser = () => action(GET_USER);