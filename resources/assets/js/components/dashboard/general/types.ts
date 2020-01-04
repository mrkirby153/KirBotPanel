/**
 * A channel's log setting
 */
export interface LogSetting {
    id: string,
    server_id: string,
    channel_id: string,
    included: number,
    excluded: number,
    created_at: string,
    updated_at: string,
    channel: Channel
}

export interface Events {
    [key: string]: number
}


export enum LogMode {
    Include, Exclude
}
export interface LogEventPayload {
    id: string,
    mode: LogMode,
    number: number,
    enabled: boolean
}

export enum LogMassSelectType {
    Invert, All, None
}
export interface LogMassSelectPayload {
    id: string,
    mode: LogMode,
    type: LogMassSelectType
}