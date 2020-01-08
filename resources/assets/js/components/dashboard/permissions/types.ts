export enum PanelPermissionType {
    VIEW = "VIEW", EDIT = "EDIT", ADMIN = "ADMIN"
}

export interface PanelPermission {
    id: string,
    user_id: string,
    permission: PanelPermissionType,
    user: string | null
}

export interface RoleClearance {
    id: string,
    server_id: string,
    role_id: string,
    permission_level: number,
    name: string
}