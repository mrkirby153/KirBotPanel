import {GET_USER} from "./actions";

export interface GetUserAction {
    type: typeof GET_USER
}

interface RootReducerState {
    user: null | object
}

type RootReducerTypes = GetUserAction

const defaultState: RootReducerState = {
    user: null
};

export default function rootReducer(state = defaultState, action: RootReducerTypes) {
    switch (action.type) {
        case GET_USER:
            return {
                ...state,
                user: window.Panel.user
            };
        default:
            return state;
    }
}