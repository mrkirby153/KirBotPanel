import {all, takeEvery, call, put} from 'redux-saga/effects';
import axios from 'axios';
import {GET_LOGS, GET_LOGS_OK} from "./actions";
import {getLogsOk} from "./actionCreators";

function* getLogs() {
    try {
        const results = yield call(axios.get, '/api/log-events');
        yield put(getLogsOk(results.data))
    } catch (e) {
        console.error(e);
    }
}


export default function* generalSaga() {
    return yield all([
        takeEvery(GET_LOGS, getLogs)
    ])
}
