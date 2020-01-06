import {all, takeLatest, call, put} from 'redux-saga/effects'
import {getType} from "typesafe-actions";
import axios from 'axios';
import * as Actions from './actions';

function* getSettings(action) {
    try{
        const results = yield call(axios.get, '/api/guild/' + action.payload + '/settings')
        yield put(Actions.getSettingsOk(results.data))
    } catch (e) {
        console.error(e);
    }
}

export default function* rootSaga() {
    return yield all([
        takeLatest(getType(Actions.getSettings), getSettings)
    ]);
}