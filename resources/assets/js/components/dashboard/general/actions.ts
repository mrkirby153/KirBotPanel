import {createAction} from "typesafe-actions";
import {LogEventPayload, LogMassSelectPayload, LogSetting} from "./types";

export const getLogEvents = createAction('GENERAL/GET_LOG_EVENTS')();
export const getLogEventsOk = createAction('GENERAL/GET_LOG_EVENTS_OK', (events: Array<String>) => events)();

export const getLogSettings = createAction('GENERAL/GET_LOG_SETTINGS')();
export const getLogSettingsOk = createAction('GENERAL/GET_LOG_SETTINGS_OK', (settings: Array<LogSetting>) => settings)();

export const onLogCheckChange = createAction('GENERAL/LOG_EVENT_CHANGE', (data: LogEventPayload) => data)();
export const logMassSelect = createAction('GENERAL/LOG_MASS_SELECT', (data: LogMassSelectPayload) => data)();
export const saveLogSettings = createAction('GENERAL/LOG_SAVE_SETTING', (id: string) => id)();
export const deleteLogSetting = createAction('GENERAL/LOG_DELETE_SETTING', (id: string) => id)();

export const createLogSetting = createAction('GENERAL/LOG_CREATE_SETTING', (channel: string) => channel)();
export const createLogSettingOk = createAction('GENERAL/LOG_CREATE_SETTING_OK', (data: LogSetting) => data)();
