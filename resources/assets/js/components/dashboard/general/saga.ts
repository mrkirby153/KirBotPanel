import {all, call, put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {GET_LOG_EVENTS, GET_LOGS, LOG_CREATE_SETTINGS, LOG_DELETE_SETTING, LOG_SAVE_SETTING} from "./actions";
import {createLogSettingOk, getLogEventsOk, getLogSettingsOk} from "./actionCreators";
import {LogSetting} from "./types";
import ld_find from 'lodash/find';

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
    try{
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
        takeEvery(GET_LOG_EVENTS, getLogs),
        takeEvery(GET_LOGS, getLogSettings),
        takeLatest(LOG_SAVE_SETTING, saveLogSettings),
        takeLatest(LOG_DELETE_SETTING, deleteLogSettings),
        takeLatest(LOG_CREATE_SETTINGS, createLogSettings)
    ])
}
