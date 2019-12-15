import {all, takeEvery, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {GET_LOGS, GET_LOGS_OK} from "./actions";

function* getLogs() {
    try {
        const results = yield call(axios.get, '/api/log-events');
        yield put({
            type: GET_LOGS_OK,
            actions: Object.keys(results.data)
        })
    } catch (e) {
        console.error(e);
    }
}


export default function* generalSaga() {
    return yield all([
        takeEvery(GET_LOGS, getLogs)
    ])
}
