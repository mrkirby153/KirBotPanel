import {call, put, takeEvery, takeLeading, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import * as Actions from "./actions";
import {ActionType, getType} from "typesafe-actions";

function* getCommands() {
    try {
        let resp = yield call(axios.get, '/api/guild/' + window.Panel.Server.id + '/commands');
        yield put(Actions.getCustomCommandsOk(resp.data))
    } catch (e) {
        console.log(e);
    }
}

function* saveCommand(action: ActionType<typeof Actions.saveCustomCommand>) {
    try {
        let command = action.payload;
        let payload = {
            name: command.name,
            description: command.data,
            clearance: command.clearance_level,
            respect_whitelist: command.respect_whitelist
        };
        if (command.id) {
            // Update the command
            let resp = yield call(axios.patch, '/api/guild/' + window.Panel.Server.id + '/commands/' + command.id, payload);
            yield put(Actions.saveCustomCommandOk(resp.data))
        } else {
            // Create the command
            let resp = yield call(axios.put, '/api/guild/' + window.Panel.Server.id + '/commands', payload);
            yield put(Actions.saveCustomCommandOk(resp.data))
        }
    } catch (e) {
        yield put(Actions.saveCustomCommandFail(e.response.data))
    }
}

function* deleteCommand(action: ActionType<typeof Actions.deleteCustomCommand>) {
    try {
        yield call(axios.delete, '/api/guild/' + window.Panel.Server.id + '/commands/' + action.payload);
    } catch (e) {
        console.error(e);
    }
}

function* getCommandAliases() {
    try {
        let resp = yield call(axios.get, '/api/guild/' + window.Panel.Server.id + '/commands/aliases');
        yield put(Actions.getCommandAliasesOk(resp.data))
    } catch (e) {
        console.error(e)
    }
}

function* createCommandAlias(action: ActionType<typeof Actions.createCommandAlias>) {
    try {
        let resp = yield call(axios.put, '/api/guild/' + window.Panel.Server.id + '/commands/aliases', {
            command: action.payload.command,
            alias: action.payload.alias,
            clearance: action.payload.clearance
        });
        yield put(Actions.createCommandAliasOk(resp.data))
    } catch (e) {
        console.error(e);
    }
}

function* deleteCommandAlias(action: ActionType<typeof Actions.deleteCommandAlias>) {
    try {
        yield call(axios.delete, '/api/guild/' + window.Panel.Server.id + '/commands/aliases/' + action.payload);
    } catch (e) {
        console.error(e);
    }
}

export default function* rootSaga() {
    yield takeEvery(getType(Actions.getCustomCommands), getCommands);
    yield takeEvery(getType(Actions.saveCustomCommand), saveCommand);
    yield takeEvery(getType(Actions.deleteCustomCommand), deleteCommand);
    yield takeLatest(getType(Actions.getCommandAliases), getCommandAliases);
    yield takeLeading(getType(Actions.createCommandAlias), createCommandAlias);
    yield takeLeading(getType(Actions.deleteCommandAlias), deleteCommandAlias);
}