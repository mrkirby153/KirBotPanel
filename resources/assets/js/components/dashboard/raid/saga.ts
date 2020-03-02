import * as Actions from './actions';
import {call, put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {getType} from "typesafe-actions";

function* getPastRaids() {
    try {
        const resp = yield call(axios.get, '/api/guild/' + window.Panel.Server.id + '/raids')
        yield put(Actions.getPastRaidsOk(resp.data));
    } catch (e) {
        console.error(e);
    }
}

export default function* raidRootSaga() {
    yield takeLatest(getType(Actions.getPastRaids), getPastRaids);
}