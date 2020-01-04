import {
    GET_LOG_EVENTS,
    GET_LOG_EVENTS_OK,
    GET_LOGS,
    GET_LOGS_OK, LOG_CREATE_SETTINGS, LOG_CREATE_SETTINGS_OK, LOG_DELETE_SETTING,
    LOG_EVENT_CHANGE,
    LOG_MASS_SELECT,
    LOG_SAVE_SETTING
} from "./actions";
import {action} from "typesafe-actions";
import {LogEventPayload, LogMassSelectPayload, LogSetting} from "./types";

export const getLogEvents = () => action(GET_LOG_EVENTS);
export const getLogEventsOk = (data: Array<String>) => action(GET_LOG_EVENTS_OK, data);

export const getLogSettings = () => action(GET_LOGS);
export const getLogSettingsOk = (data: Array<LogSetting>) => action(GET_LOGS_OK, data);

export const onLogCheckChange = (data: LogEventPayload) =>  action(LOG_EVENT_CHANGE, data);
export const logMassSelect = (data: LogMassSelectPayload) => action(LOG_MASS_SELECT, data);
export const saveLogSettings = (id: string) => action(LOG_SAVE_SETTING, id);
export const deleteLogSetting = (id: string) => action(LOG_DELETE_SETTING, id);

export const createLogSetting = (channel: string) => action(LOG_CREATE_SETTINGS, channel);
export const createLogSettingOk = (data: LogSetting) => action(LOG_CREATE_SETTINGS_OK, data);