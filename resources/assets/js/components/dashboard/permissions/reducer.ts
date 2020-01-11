import {Reducer} from "redux";
import {ActionType, getType} from "typesafe-actions";
import * as Actions from './actions';
import ld_filter from 'lodash/filter';
import ld_find from 'lodash/find';
import {PanelPermission, RoleClearance} from "./types";

interface PermissionReducerState {
    panelPermissions: PanelPermission[]
    roleClearances: RoleClearance[]
}

const defaultState: PermissionReducerState = {
    panelPermissions: [],
    roleClearances: []
};

type PermissionAction = ActionType<typeof Actions>

const reducer: Reducer<PermissionReducerState, PermissionAction> = (state = defaultState, action) => {
    switch (action.type) {
        case getType(Actions.getPanelPermissionsOk):
            return {
                ...state,
                panelPermissions: action.payload
            };
        case getType(Actions.createPanelPermissionOk):
            return {
                ...state,
                panelPermissions: [...state.panelPermissions, action.payload]
            };
        case getType(Actions.deletePanelPermission):
            return {
                ...state,
                panelPermissions: ld_filter(state.panelPermissions, perm => perm.id != action.payload)
            };
        case getType(Actions.modifyPanelPermission):
            let permissions = [...state.panelPermissions];
            let target = ld_find(permissions, {id: action.payload.id});
            if (target) {
                target.permission = action.payload.permission
            }
            return {
                ...state,
                panelPermissions: permissions
            };
        case getType(Actions.getRoleClearanceOk):
            return {
                ...state,
                roleClearances: action.payload
            };
        case getType(Actions.deleteRoleClearance):
            return {
                ...state,
                roleClearances: ld_filter(state.roleClearances, clearance => clearance.id != action.payload)
            };
        case getType(Actions.modifyRoleClearance):
            let clearances = [...state.roleClearances];
            let targetRole = ld_find(clearances, {id: action.payload.id});
            if (targetRole) {
                targetRole.permission_level = action.payload.clearance;
            }
            return {
                ...state,
                roleClearances: clearances
            };
        case getType(Actions.createRoleClearanceOk):
            return {
                ...state,
                roleClearances: [...state.roleClearances, action.payload]
            };
        default:
            return state
    }
};
export default reducer