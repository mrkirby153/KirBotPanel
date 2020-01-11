import {createAction} from "typesafe-actions";
import {PanelPermission, PanelPermissionType, RoleClearance} from "./types";

export const getPanelPermissions = createAction('PERMISSIONS/GET_PANEL_PERMISSIONS')();
export const getPanelPermissionsOk = createAction('PERMISSIONS/GET_PANEL_PERMISSIONS_OK', (data: PanelPermission[]) => data)();
export const createPanelPermission = createAction('PERMISSIONS/CREATE_PANEL_PERMISSION', (userId: string, type: PanelPermissionType) => {
    return {userId, type}
})();
export const createPanelPermissionOk = createAction('PERMISSIONS/CREATE_PANEL_PERMISSION_OK', (permission: PanelPermission) => permission)();
export const deletePanelPermission = createAction('PERMISSIONS/DELETE_PANEL_PERMISSION', (id: string) => id)();
export const modifyPanelPermission = createAction('PERMISSIONS/MODIFY_PANEL_PERMISSION', (id: string, permission: PanelPermissionType) => {
    return {id, permission}
})();

export const getRoleClearance = createAction('PERMISSIONS/GET_ROLE_CLEARANCE')();
export const getRoleClearanceOk = createAction('PERMISSIONS/GET_ROLE_CLEARANCE_OK', (permissions: RoleClearance[]) => permissions)();
export const modifyRoleClearance = createAction('PERMISSIONS/MODIFY_ROLE_CLEARANCE', (id: string, clearance: number) => {
    return {id, clearance}
})();
export const deleteRoleClearance = createAction('PERMISSIONS/DELETE_ROLE_CLEARANCE', (id: string) => id)();
export const createRoleClearance = createAction('PERMISSIONS/CREATE_ROLE_CLEARANCE', (role: string, clearance: number) => {
    return {role, clearance}
})();
export const createRoleClearanceOk = createAction('PERMISSIONS/CREATE_ROLE_CLEARANCE_OK', (clearance: RoleClearance) => clearance)();