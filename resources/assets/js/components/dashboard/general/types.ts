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

export interface LogEventPayload {
    id: string,
    mode: 'include' | 'exclude',
    number: number,
    enabled: boolean
}

export interface LogMassSelectPayload {
    id: string,
    mode: 'include' | 'exclude',
    type: 'invert'| 'all' | 'none'
}