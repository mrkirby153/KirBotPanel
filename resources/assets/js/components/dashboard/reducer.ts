import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import {Reducer} from "redux";

export interface RootReducerState {
    user: User | null,
    settings: {
        [key: string]: any
    },
    settingsLoaded: boolean
}

const defaultState: RootReducerState = {
    user: null,
    settings: {},
    settingsLoaded: false
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
                settings: action.payload,
                settingsLoaded: true
            };
        case getType(Actions.setSetting):
            return {
                ...state,
                settings: {
                    ...state.settings,
                    [action.payload.key]: action.payload.value
                }
            };
        default:
            return state;
    }
};
export default reducer;