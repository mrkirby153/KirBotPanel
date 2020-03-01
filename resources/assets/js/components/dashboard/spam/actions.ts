import {createAction} from "typesafe-actions";
import {SpamPunishment, SpamRule} from "./types";

export const loadSpamRules = createAction('SPAM/LOAD_SPAM_RULES', (rules: SpamRule[], punishment: SpamPunishment, duration: string | null | undefined, cleanDuration: string | null | undefined, cleanAmount: string | null | undefined) => {
    return {
        rules, punishment, duration, cleanDuration, cleanAmount
    }
})();

export const setPunishment = createAction('SPAM/SET_PUNISHMENT', (punishment: SpamPunishment) => punishment)();
export const setPunishKey = createAction('SPAM/SET_PUNISH_KEY', (key: 'punishment_duration' | 'clean_amount' | 'clean_duration', value: string) => {
    return {
        key, value
    }
})();
export const setSpamItem = createAction('SPAM/SET_ITEM', (id: string, rule: string, type: 'count' | 'period', value: string) => {
    return {
        id, type, value, rule
    }
})();
export const setLevel = createAction('SPAM/SET_LEVEL', (id: string, level: string) => {
    return {
        id, level
    }
})();

export const createSpamRule = createAction('SPAM/CREATE_RULE')();
export const deleteSpamRule = createAction('SPAM/DELETE_RULE', (rule: string) => rule)();