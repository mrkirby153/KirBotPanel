// Interface for global data
interface ServerSetting {
    id: string,
    guild: string,
    key: string,
    value: string
}
interface Window {
    user?: {
        id: string,
        username: string,
        admin: number,
        created_at: string,
        updated_at: string
    }
    Server: {
        id: string,
        name: string,
        icon_id: string|null,
        settings: ServerSetting[]
    }
}