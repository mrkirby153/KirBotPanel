import {GET_USER} from "./actions";
import {GetUserAction} from "./reducer";

export function getUser(): GetUserAction {
    return {
        type: GET_USER
    }
}