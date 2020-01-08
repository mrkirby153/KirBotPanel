import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import * as Actions from './actions';
import {ActionType, getType} from "typesafe-actions";
import axios from 'axios';
import {PanelPermissionType} from "./types";

function* getPanelPermissions() {
    try {
        const response = yield call(axios.get, '/api/guild/' + window.Panel.Server.id + '/permissions/panel');
        yield put(Actions.getPanelPermissionsOk(response.data));
    } catch (e) {
        console.error(e);
    }
}

function* createPanelPermission(action: ActionType<typeof Actions.createPanelPermission>) {
    const payload = action.payload;
    const uid = payload.userId;
    const type: PanelPermissionType = payload.type;
    try {
        const response = yield call(axios.put, '/api/guild/' + window.Panel.Server.id + '/permissions/panel', {
            id: uid,
            permission: type
        });
        yield put(Actions.createPanelPermissionOk(response.data));
    } catch (e) {
        console.error(e);
    }
}

function* deletePanelPermission(action: ActionType<typeof Actions.deletePanelPermission>) {
    try {
        yield call(axios.delete, '/api/guild/' + window.Panel.Server.id + '/permissions/panel/' + action.payload);
    } catch (e) {
        console.error(e);
    }
}

function* modifyPanelPermission(action: ActionType<typeof Actions.modifyPanelPermission>) {
    try {
        yield call(axios.patch, '/api/guild/' + window.Panel.Server.id + '/permissions/panel/' + action.payload.id, {
            permission: action.payload.permission
        });
    } catch (e) {
        console.error(e);
    }
}

export default function* rootSaga() {
    yield takeLatest(getType(Actions.getPanelPermissions), getPanelPermissions);
    yield takeEvery(getType(Actions.createPanelPermission), createPanelPermission);
    yield takeEvery(getType(Actions.deletePanelPermission), deletePanelPermission);
    yield takeEvery(getType(Actions.modifyPanelPermission), modifyPanelPermission);
}