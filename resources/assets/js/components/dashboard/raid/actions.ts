import {createAction} from "typesafe-actions";
import {Raid} from "./types";

export const getPastRaids = createAction('RAID/GET_PAST_RAIDS')();
export const getPastRaidsOk = createAction('RAID/GET_PAST_RAIDS_OK', (raids: Raid[]) => raids)();