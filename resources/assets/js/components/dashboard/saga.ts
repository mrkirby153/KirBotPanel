import {all, call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {getType} from "typesafe-actions";
import axios from 'axios';
import * as Actions from './actions';
import {SetSettingAction} from "./types";
import toastr from 'toastr';

function* getSettings(action) {
    try {
        const results = yield call(axios.get, '/api/guild/' + action.payload + '/settings');
        yield put(Actions.getSettingsOk(results.data))
    } catch (e) {
        console.error(e);
    }
}

function* setSetting(action) {
    const payload: SetSettingAction = action.payload;
    if (payload.persist) {
        try {
            yield call(axios.patch, '/api/guild/' + payload.guild + '/setting', {
                key: payload.key,
                value: payload.value
            })
        } catch (e) {
            if (e.response.status == 422) {
                toastr.warning(`Key ${payload.key} is not whitelisted for saving`);
            }
        }
    }
}

export default function* rootSaga() {
    return yield all([
        takeLatest(getType(Actions.getSettings), getSettings),
        takeEvery(getType(Actions.setSetting), setSetting)
    ]);
}