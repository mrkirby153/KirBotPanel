import {createAction} from "typesafe-actions";
import {SpamPunishment, SpamRule} from "./types";

export const loadSpamRules = createAction('SPAM/LOAD_SPAM_RULES', (rules: SpamRule[], punishment: SpamPunishment, duration: number | null | undefined, cleanDuration: number | null | undefined, cleanAmount: number | null | undefined) => {
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