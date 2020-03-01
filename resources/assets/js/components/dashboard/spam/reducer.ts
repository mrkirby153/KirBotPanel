import {Reducer} from "redux";
import {SpamPunishment, SpamRule} from "./types";
import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import {makeId} from "../../../utils";

export interface SpamReducerState {
    punishment: SpamPunishment
    punishment_duration: number | string,
    clean_duration: number | string,
    clean_amount: number | string,
    rules: SpamRule[]
}

const defaultState: SpamReducerState = {
    punishment: SpamPunishment.NONE,
    punishment_duration: "",
    clean_amount: "",
    clean_duration: "",
    rules: []
};

type SpamAction = ActionType<typeof Actions>
const reducer: Reducer<SpamReducerState, SpamAction> = (state = defaultState, action) => {
    switch (action.type) {
        case getType(Actions.loadSpamRules): {
            let rules = [...action.payload.rules];
            rules.forEach(rule => {
                if(!rule._id)
                    rule._id = makeId(5);
            });
            return {
                ...state,
                punishment: action.payload.punishment || SpamPunishment.NONE,
                punishment_duration: action.payload.duration || "",
                clean_amount: action.payload.cleanAmount || "",
                clean_duration: action.payload.cleanDuration || "",
                rules: rules
            }
        }
        case getType(Actions.setPunishment): {
            return {
                ...state,
                punishment: action.payload
            }
        }
        case getType(Actions.setPunishKey): {
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        }
        default: {
            return state;
        }
    }
};

export default reducer;