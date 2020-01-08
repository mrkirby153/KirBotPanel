import {createAction} from "typesafe-actions";
import {PanelPermission, PanelPermissionType} from "./types";

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
