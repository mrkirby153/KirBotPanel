import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import {Reducer} from "redux";

interface RootReducerState {
    user: User | null,
    settings: {
        [key: string]: any
    }
}

const defaultState: RootReducerState = {
    user: null,
    settings: {}
};

type DashboardAction = ActionType<typeof Actions>

const reducer: Reducer<RootReducerState, DashboardAction> = (state = defaultState, action: DashboardAction) => {
    switch (action.type) {
        case getType(Actions.getUser):
            return {
                ...state,
                user: window.Panel.user
            };
        case getType(Actions.getSettingsOk):
            return {
                ...state,
                settings: action.payload
            };
        default:
            return state;
    }
};
export default reducer;