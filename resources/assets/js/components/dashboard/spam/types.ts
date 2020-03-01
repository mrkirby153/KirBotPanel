export enum SpamPunishment {
    NONE = "NONE", MUTE = "MUTE", KICK = "KICK", BAN = "BAN", TEMP_BAN = "TEMPBAN", TEMP_MUTE = "TEMP_MUTE"
}

export interface SpamRule {
    _id?: string,
    _level?: string,

    [key: string]: SpamRuleSetting | string | undefined
}

export interface SpamRuleSetting {
    count: string | number,
    period: string | number
}

export interface SpamSettings {
    punishment: SpamPunishment
    punishment_duration: string | null,
    clean_duration: string | null,
    clean_amount: string | null,
    rules: SpamRule[]
}