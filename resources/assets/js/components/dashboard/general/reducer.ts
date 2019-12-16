import {GET_LOGS_OK} from "./actions";
import {Reducer} from "redux";

interface GeneralReducerState {
    logActions: Array<String>
    getLogsInProgress: boolean
}

const defaultState: GeneralReducerState = {
    logActions: [],
    getLogsInProgress: false
};

const reducer: Reducer<GeneralReducerState> = (state = defaultState, action) => {
    switch (action.type) {
        case GET_LOGS_OK: {
            return { ...state, logActions: action.payload }
        }
        default: {
            return state
        }
    }
};
export default reducer;