import {Reducer} from "redux";
import * as Actions from './actions';
import {LogEventPayload, LogMassSelectPayload, LogMassSelectType, LogMode, LogSetting} from "./types";
import ld_findIndex from 'lodash/findIndex';
import ld_filter from 'lodash/filter';
import {ActionType, getType} from "typesafe-actions";

interface GeneralReducerState {
    logActions: Array<String>
    logSettings: LogSetting[]
}

const defaultState: GeneralReducerState = {
    logActions: [],
    logSettings: []
};

export type GeneralAction = ActionType<typeof Actions>

const reducer: Reducer<GeneralReducerState, GeneralAction> = (state = defaultState, action: GeneralAction) => {
    switch (action.type) {
        case getType(Actions.getLogEventsOk): {
            return { ...state, logActions: action.payload }
        }
        case getType(Actions.getLogSettingsOk): {
            return {... state, logSettings: action.payload }
        }
        case getType(Actions.onLogCheckChange): {
            const payload: LogEventPayload = action.payload;
            let index = ld_findIndex(state.logSettings, f => f.id == payload.id);
            let settings = Object.assign({}, state.logSettings[index]);

            let mode = payload.mode == LogMode.Include ? 'included' : 'excluded';
            if (payload.enabled) {
                settings[mode] |= payload.number
            } else {
                settings[mode] &= ~payload.number;
            }

            let newSettings = [... state.logSettings];
            newSettings[index] = settings;
            return {
                ...state,
                logSettings: newSettings,
            }
        }
        case getType(Actions.logMassSelect): {
            const payload: LogMassSelectPayload = action.payload;

            let index = ld_findIndex(state.logSettings, f => f.id == payload.id);
            let settings = Object.assign({}, state.logSettings[index]);

            let mode = payload.mode == LogMode.Include? 'included' : 'excluded';

            let val = settings[mode];
            switch(payload.type) {
                case LogMassSelectType.All:
                    Object.keys(state.logActions).forEach(key => {
                        val |= state.logActions[key]
                    });
                    break;
                case LogMassSelectType.None:
                    val = 0;
                    break;
                case LogMassSelectType.Invert:
                    val = ~val;
                    break;
            }

            settings[mode] = val;
            let newSettings = [... state.logSettings];
            newSettings[index] = settings;
            return {
                ...state,
                logSettings: newSettings
            }
        }
        case getType(Actions.deleteLogSetting): {
            let settings = ld_filter(state.logSettings, f => f.id != action.payload);
            return {
                ...state,
                logSettings: settings
            }
        }
        case getType(Actions.createLogSettingOk): {
            let settings = [... state.logSettings];
            settings.push(action.payload);
            return {
                ...state,
                logSettings: settings
            }
        }
        default: {
            return state
        }
    }
};
export default reducer;