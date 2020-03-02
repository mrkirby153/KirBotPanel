import {Reducer} from "redux";
import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import {Raid} from "./types";

export interface RaidReducerState {
    raids: Raid[]
}

const defaultState: RaidReducerState = {
    raids: []
};

type SpamAction = ActionType<typeof Actions>
const reducer: Reducer<RaidReducerState, SpamAction> = (state = defaultState, action) => {
    switch (action.type) {
        case getType(Actions.getPastRaidsOk): {
            return {
                ...state,
                raids: action.payload,
            }
        }
        default: {
            return state;
        }
    }
};

export default reducer;