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