import {all, call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {createLogSettingOk, getLogEventsOk, getLogSettingsOk} from "./actionCreators";
import {LogSetting} from "./types";
import ld_find from 'lodash/find';
import {LOGS} from "./actions";

function* getLogs() {
    try {
        const results = yield call(axios.get, '/api/log-events');
        yield put(getLogEventsOk(results.data))
    } catch (e) {
        console.error(e);
    }
}

function* getLogSettings() {
    try {
        const results = yield call(axios.get, '/api/guild/' + window.Panel.Server.id + '/log-settings');
        yield put(getLogSettingsOk(results.data));
    } catch (e) {
        console.error(e);
    }
}

function* saveLogSettings(action) {
    const getSettings = (state): LogSetting => {
        return ld_find(state.general.log_settings, l => l.id == action.payload)
    };
    const data = yield select(getSettings);
    try {
        yield call(axios.patch, '/api/guild/' + window.Panel.Server.id + '/log-settings/' + action.payload, {
            include: data.included,
            exclude: data.excluded
        })
    } catch (e) {
        console.error(e);
    }
}

function* deleteLogSettings(action) {
    try {
        yield call(axios.delete, '/api/guild/' + window.Panel.Server.id + '/log-settings/' + action.payload)
    } catch (e) {
        console.error(e);
    }
}

function* createLogSettings(action) {
    try {
        const results = yield call(axios.put, '/api/guild/' + window.Panel.Server.id + '/log-settings', {
            channel: action.payload
        });
        yield put(createLogSettingOk(results.data));
    } catch (e) {
        console.error(e);
    }
}

export default function* generalSaga() {
    return yield all([
        takeEvery(LOGS.GET_LOG_EVENTS, getLogs),
        takeEvery(LOGS.GET_LOG_SETTINGS, getLogSettings),
        takeLatest(LOGS.SAVE_SETTING, saveLogSettings),
        takeLatest(LOGS.DELETE_SETTING, deleteLogSettings),
        takeLatest(LOGS.CREATE_SETTING, createLogSettings)
    ])
}
