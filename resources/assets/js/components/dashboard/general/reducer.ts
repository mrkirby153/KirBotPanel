import {GET_LOGS, GET_LOGS_OK} from "./actions";

export interface GetLogsAction {
    type: string
}

export interface GetLogsOkAction {
    type: string,
    actions: Array<String>
}

interface GeneralReducerState {
    logActions: Array<String>
    getLogsInProgress: boolean
}

type GeneralReducerTypes = GetLogsAction & GetLogsOkAction

const defaultState: GeneralReducerState = {
    logActions: [],
    getLogsInProgress: false
};

export default function generalReducer(state = defaultState, action: GeneralReducerTypes) {
    switch (action.type) {
        case GET_LOGS:
            return {
                ...state,
                getLogsInProgress: true
            };
        case GET_LOGS_OK:
            return {
                ...state,
                getLogsInProgress: false,
                logActions: action.actions
            };
        default:
            return state;
    }
}