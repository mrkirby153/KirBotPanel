import {Reducer} from "redux";
import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import {Infraction} from "./types";

export interface InfractionReducerState {
    loading: boolean,
    error: null | any,
    page: number,
    max_pages: number,
    data: Infraction[]
}

const defaultState: InfractionReducerState = {
    loading: false,
    error: null,
    page: 0,
    max_pages: 0,
    data: []
};

type InfractionAction = ActionType<typeof Actions>

const reducer: Reducer<InfractionReducerState, InfractionAction> = (state = defaultState, action) => {
    switch (action.type) {
        case getType(Actions.getInfractions):
            return {
                ...state,
                loading: true,
                error: null,
            };
        case getType(Actions.getInfractionsFail):
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case getType(Actions.getInfractionsOk):
            return {
                ...state,
                loading: false,
                error: null,
                page: action.payload.current_page,
                max_pages: action.payload.last_page,
                data: action.payload.data
            };
        default:
            return state;
    }
};

export default reducer;