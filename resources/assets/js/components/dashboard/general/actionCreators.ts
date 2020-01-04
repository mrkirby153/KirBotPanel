import {LOGS} from "./actions";
import {action} from "typesafe-actions";
import {LogEventPayload, LogMassSelectPayload, LogSetting} from "./types";

export const getLogEvents = () => action(LOGS.GET_LOG_EVENTS);
export const getLogEventsOk = (data: Array<String>) => action(LOGS.GET_LOG_EVENTS_OK, data);

export const getLogSettings = () => action(LOGS.GET_LOG_SETTINGS);
export const getLogSettingsOk = (data: Array<LogSetting>) => action(LOGS.GET_LOG_SETTINGS_OK, data);

export const onLogCheckChange = (data: LogEventPayload) => action(LOGS.EVENT_CHANGE, data);
export const logMassSelect = (data: LogMassSelectPayload) => action(LOGS.MASS_SELECT, data);
export const saveLogSettings = (id: string) => action(LOGS.SAVE_SETTING, id);
export const deleteLogSetting = (id: string) => action(LOGS.DELETE_SETTING, id);

export const createLogSetting = (channel: string) => action(LOGS.CREATE_SETTING, channel);
export const createLogSettingOk = (data: LogSetting) => action(LOGS.CREATE_SETTING_OK, data);