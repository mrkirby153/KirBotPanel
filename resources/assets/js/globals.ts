// Interface for global data
declare interface ServerSetting {
    id: string,
    guild: string,
    key: string,
    value: string
}
declare interface Channel {
    id: string,
    server: string,
    channel_name: string,
    type: 'TEXT' | 'VOICE',
    hidden: number
}

declare interface Role {
    id: string,
    name: string,
    order: number,
    permissions: number,
    server_id: string,
    created_at: string,
    updated_at: string
}

declare interface Panel {
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
        settings: ServerSetting[],
        channels: Channel[],
        roles: Role[]
    }
}

declare interface Window {
    Panel: Panel
}