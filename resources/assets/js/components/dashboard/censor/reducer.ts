import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import {Reducer} from "redux";
import {CensorRule} from "./types";
import {makeId, setObject, traverseObject} from "../../../utils";
import ld_find from 'lodash/find';

export interface CensorReducerState {
    changed: boolean,
    rules: CensorRule[]
}

const defaultState: CensorReducerState = {
    rules: [],
    changed: false
};

type CensorAction = ActionType<typeof Actions>

const reducer: Reducer<CensorReducerState, CensorAction> = (state = defaultState, action) => {
    switch (action.type) {
        case getType(Actions.loadCensorRules): {
            let rules = [...action.payload];
            rules.forEach(rule => {
                if (!rule._id) {
                    rule._id = makeId(5)
                }
            });
            return {
                ...state,
                rules: rules,
                changed: false
            }
        }
        case getType(Actions.modifySection): {
            let rules = [...state.rules];
            let rule = ld_find(rules, {_id: action.payload.ruleId});
            if (!rule) {
                console.warn("Attempting to modify a rule that does not exist");
                return state;
            }
            traverseObject(action.payload.path, rule).splice(action.payload.n, 1, action.payload.value);
            return {
                ...state,
                rules: rules,
                changed: true
            }
        }
        case getType(Actions.addValue): {
            let rules = [...state.rules];
            let rule = ld_find(rules, {_id: action.payload.ruleId});
            if (!rule) {
                console.warn("Attempting to modify a rule that does not exist");
                return state;
            }
            traverseObject(action.payload.path, rule).push("");
            return {
                ...state,
                rules: rules,
                changed: true
            }

        }
        case getType(Actions.deleteValue): {
            let rules = [...state.rules];
            let rule = ld_find(rules, {_id: action.payload.ruleId});
            if (!rule) {
                console.warn("Attempting to modify a rule that does not exist");
                return state;
            }
            traverseObject(action.payload.path, rule).splice(action.payload.n, 1);
            return {
                ...state,
                rules: rules,
                changed: true
            }
        }
        case getType(Actions.checkValue):
            let rules = [...state.rules];
            let rule = ld_find(rules, {_id: action.payload.ruleId});
            if (!rule) {
                console.warn("Attempting to modify a rule that does not exist");
                return state;
            }
            setObject(action.payload.path, rule, action.payload.value);
            return {
                ...state,
                rules: rules,
                changed: true
            };
        case getType(Actions.deleteCensorRule): {
            return {
                ...state,
                rules: state.rules.filter(rule => rule._id != action.payload)
            }
        }
        case getType(Actions.createCensorRule): {
            let newRule: CensorRule = {
                _level: undefined,
                _id: makeId(5),
                zalgo: false,
                blocked_tokens: [],
                blocked_words: [],
                invites: {
                    enabled: false,
                    guild_blacklist: [],
                    guild_whitelist: []
                },
                domains: {
                    enabled: false,
                    blacklist: [],
                    whitelist: []
                }
            };
            return {
                ...state,
                rules: [...state.rules, newRule]
            }
        }
        case getType(Actions.modifyCensorLevel): {
            const rules = [...state.rules];
            const rule = ld_find(rules, {_id: action.payload.id});
            if (!rule) {
                console.warn("Attempting to edit a rule that does not exist");
                return state;
            }
            rule._level = action.payload.level;
            return {
                ...state,
                rules: rules,
                changed: true
            }
        }
        default: {
            return state;
        }
    }
};
export default reducer;