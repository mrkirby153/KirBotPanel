import {
    GET_LOG_EVENTS_OK,
    GET_LOGS_OK,
    LOG_CREATE_SETTINGS_OK,
    LOG_DELETE_SETTING,
    LOG_EVENT_CHANGE,
    LOG_MASS_SELECT
} from "./actions";
import {Reducer} from "redux";
import {LogEventPayload, LogMassSelectPayload, LogSetting} from "./types";
import ld_findIndex from 'lodash/findIndex';
import ld_filter from 'lodash/filter';

interface GeneralReducerState {
    logActions: Array<String>
    getLogsInProgress: boolean
    log_settings: LogSetting[]
}

const defaultState: GeneralReducerState = {
    logActions: [],
    getLogsInProgress: false,
    log_settings: []
};

const reducer: Reducer<GeneralReducerState> = (state = defaultState, action) => {
    switch (action.type) {
        case GET_LOG_EVENTS_OK: {
            return { ...state, logActions: action.payload }
        }
        case GET_LOGS_OK: {
            return {... state, log_settings: action.payload }
        }
        case LOG_EVENT_CHANGE: {
            const payload: LogEventPayload = action.payload;
            let index = ld_findIndex(state.log_settings, f => f.id == payload.id);
            let settings = Object.assign({}, state.log_settings[index]);

            let mode = payload.mode == 'include'? 'included' : 'excluded';
            if (payload.enabled) {
                settings[mode] |= payload.number
            } else {
                settings[mode] &= ~payload.number;
            }

            let newSettings = [... state.log_settings];
            newSettings[index] = settings;
            return {
                ...state,
                log_settings: newSettings
            }
        }
        case LOG_MASS_SELECT: {
            const payload: LogMassSelectPayload = action.payload;

            let index = ld_findIndex(state.log_settings, f => f.id == payload.id);
            let settings = Object.assign({}, state.log_settings[index]);

            let mode = payload.mode == 'include'? 'included' : 'excluded';

            let val = settings[mode];
            switch(payload.type) {
                case "all":
                    Object.keys(state.logActions).forEach(key => {
                        val |= state.logActions[key]
                    });
                    break;
                case "none":
                    val = 0;
                    break;
                case "invert":
                    val = ~val;
                    break;
            }

            settings[mode] = val;
            let newSettings = [... state.log_settings];
            newSettings[index] = settings;
            return {
                ...state,
                log_settings: newSettings
            }
        }
        case LOG_DELETE_SETTING: {
            let settings = ld_filter(state.log_settings, f => f.id != action.payload);
            return {
                ...state,
                log_settings: settings
            }
        }
        case LOG_CREATE_SETTINGS_OK: {
            let settings = [... state.log_settings];
            settings.push(action.payload);
            return {
                ...state,
                log_settings: settings
            }
        }
        default: {
            return state
        }
    }
};
export default reducer;