import {createAction} from "typesafe-actions";

export const getUser = createAction('GET_USER')();
export const getSettings = createAction('GET_SETTINGS', (guild: string) => guild)();
export const getSettingsOk = createAction('GET_SETTINGS_OK', (settings: {[key: string]: any}) => settings)();