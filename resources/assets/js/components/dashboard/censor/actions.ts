import {createAction} from "typesafe-actions";
import {CensorRule} from "./types";

export const loadCensorRules = createAction('CENSOR/LOAD_RULES', (rules: CensorRule[]) => rules)();
export const deleteCensorRule = createAction('CENSOR/DELETE_RULE', (id: string) => id)();
export const createCensorRule = createAction('CENSOR/CREATE_RULE')();
export const modifyCensorLevel = createAction('CENSOR/MODIFY_LEVEL', (id: string, level: string) => {
    return {
        id, level
    }
})();

export const modifySection = createAction('CENSOR/MODIFY_SECTION', (ruleId: string, path: string, n: number, value: string) => {
    return {
        ruleId, path, n, value
    }
})();
export const deleteValue = createAction('CENSOR/DELETE_VALUE', (ruleId: string, path: string, n: number) => {
    return {
        ruleId, path, n
    }
})();
export const addValue = createAction('CENSOR/ADD_VALUE', (ruleId: string, path: string) => {
    return {
        ruleId, path
    }
})();

export const checkValue = createAction('CENSOR/CHECK_VALUE', (ruleId: string, path: string, value: boolean) => {
    console.log(`Constructing check value with rule id = ${ruleId} Path = ${path} and value = ${value}`);
    return {
        ruleId, path, value
    }
})();