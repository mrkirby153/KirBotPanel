
export interface Guild {
    id: string,
    name: string,
    icon_id: string | null,
    owner: string,
    created_at: string,
    updated_at: string,
    deleted_at?: string,

    settings: ServerSetting[]
}