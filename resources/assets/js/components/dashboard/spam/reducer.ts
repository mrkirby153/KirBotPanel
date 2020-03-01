import {Reducer} from "redux";
import {SpamPunishment, SpamRule} from "./types";
import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import {makeId} from "../../../utils";
import ld_find from 'lodash/find';

export interface SpamReducerState {
    punishment: SpamPunishment
    punishment_duration: string | null,
    clean_duration: string | null,
    clean_amount: string | null,
    rules: SpamRule[],
    changed: boolean
}

const defaultState: SpamReducerState = {
    punishment: SpamPunishment.NONE,
    punishment_duration: "",
    clean_amount: "",
    clean_duration: "",
    rules: [],
    changed: false
};

type SpamAction = ActionType<typeof Actions>
const reducer: Reducer<SpamReducerState, SpamAction> = (state = defaultState, action) => {
    switch (action.type) {
        case getType(Actions.loadSpamRules): {
            let rules = [...action.payload.rules];
            rules.forEach(rule => {
                if (!rule._id)
                    rule._id = makeId(5);
            });
            return {
                ...state,
                punishment: action.payload.punishment || SpamPunishment.NONE,
                punishment_duration: action.payload.duration || "",
                clean_amount: action.payload.cleanAmount || "",
                clean_duration: action.payload.cleanDuration || "",
                rules: rules,
                changed: false
            }
        }
        case getType(Actions.setPunishment): {
            return {
                ...state,
                punishment: action.payload,
                changed: true
            }
        }
        case getType(Actions.setPunishKey): {
            return {
                ...state,
                [action.payload.key]: action.payload.value,
                changed: true
            }
        }
        case getType(Actions.setSpamItem): {
            const rules = [...state.rules];
            const ruleSet = ld_find(rules, {_id: action.payload.id});
            if (!ruleSet) {
                return state;
            }
            let rule = ruleSet[action.payload.rule];
            if (!rule) {
                rule = {
                    count: "",
                    period: ""
                };
                ruleSet[action.payload.rule] = rule;
            }
            rule[action.payload.type] = action.payload.value;
            return {
                ...state,
                rules: rules,
                changed: true
            }
        }
        case getType(Actions.setLevel): {
            const rules = [...state.rules];
            const rule = ld_find(rules, {_id: action.payload.id});
            if (!rule) {
                return state;
            }
            rule._level = action.payload.level;
            return {
                ...state,
                rules: rules,
                changed: true
            }
        }
        case getType(Actions.createSpamRule): {
            const newRule: SpamRule = {
                _level: undefined,
                _id: makeId(5)
            };
            return {
                ...state,
                rules: [...state.rules, newRule],
                changed: true
            }
        }
        case getType(Actions.deleteSpamRule): {
            return {
                ...state,
                rules: state.rules.filter(rule => rule._id != action.payload),
                changed: true
            }
        }
        default: {
            return state;
        }
    }
};

export default reducer;