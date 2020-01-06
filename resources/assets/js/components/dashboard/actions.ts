import {createAction} from "typesafe-actions";
import {SetSettingAction} from "./types";

export const getUser = createAction('GET_USER')();
export const getSettings = createAction('GET_SETTINGS', (guild: string) => guild)();
export const getSettingsOk = createAction('GET_SETTINGS_OK', (settings: { [key: string]: any }) => settings)();

export const setSetting = createAction('SET_SETTING', (guild: string, key: string, value: any, persist: boolean = false): SetSettingAction => {
    return {guild, key, value, persist};
})();