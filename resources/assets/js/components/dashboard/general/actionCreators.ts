import {GET_LOGS, GET_LOGS_OK} from "./actions";
import {action} from "typesafe-actions";

export const getLogs = () => action(GET_LOGS);

export const getLogsOk = (data: Array<String>) => action(GET_LOGS_OK, data);
