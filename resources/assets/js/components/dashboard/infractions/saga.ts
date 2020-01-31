import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import {call, put, takeEvery} from "redux-saga/effects";
import axios from 'axios';

function* getInfractions(action: ActionType<typeof Actions.getInfractions>) {
    try {
        const payload = action.payload;
        const resp = yield call(axios.post, '/api/guild/' + window.Panel.Server.id + '/infractions', {
            page: payload.page,
            filtered: payload.filtered,
            sorted: payload.sorted,
            pageSize: payload.size
        });
        yield put(Actions.getInfractionsOk(resp.data));
    } catch (e) {
        yield put(Actions.getInfractionsFail(e))
    }
}

export default function* rootSaga() {
    yield takeEvery(getType(Actions.getInfractions), getInfractions)
}