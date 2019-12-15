import {GET_USER} from "./dashboard/actions";
import {GetUserAction} from "./dashboard/reducer";

export function getUser(): GetUserAction {
    return {
        type: GET_USER
    }
}