export interface CustomCommand {
    id: string,
    server: string,
    name: string,
    data: string,
    clearance_level: number,
    type: 'TEXT' | 'JAVASCRIPT',
    respect_whitelist: boolean
}

export interface CustomCommandPayload {
    id: string | null,
    name: string,
    data: string,
    clearance_level: number,
    respect_whitelist: boolean
}

export interface CommandAlias {
    id: string,
    server_id: string,
    command: string,
    alias: string,
    clearance: number,
    created_at: string,
    updated_at: string
}

export interface CreateCommandAliasPayload {
    command: string,
    alias: string | null,
    clearance: number
}