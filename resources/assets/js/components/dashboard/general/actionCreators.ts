import {GetLogsAction, GetLogsOkAction} from "./reducer";
import {GET_LOGS, GET_LOGS_OK} from "./actions";

export function getLogs(): GetLogsAction {
    return {
        type: GET_LOGS
    }
}

export function getLogsOk(data: Array<String>): GetLogsOkAction {
    return {
        type: GET_LOGS_OK,
        actions: data
    }
}