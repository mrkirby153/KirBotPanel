import {createAction} from "typesafe-actions";
import {PaginatedInfractionData} from "./types";

export const getInfractions = createAction('INFRACTION/GET_INFRACTION', (page: any, size: any, sorted: any, filtered: any) => {
    return {
        page: page + 1, size, sorted, filtered
    }
})();
export const getInfractionsOk = createAction('INFRACTION/GET_INFRACTIONS_OK', (infractions: PaginatedInfractionData) => infractions)();
export const getInfractionsFail = createAction('INFRACTION/GET_INFRACTION_FAIL', (e) => e)();