export interface CensorRule {
    _id?: string,
    _level: string | number | undefined,
    invites: {
        enabled: boolean,
        guild_whitelist: string[],
        guild_blacklist: string[]
    },
    domains: {
        enabled: boolean,
        whitelist: string[],
        blacklist: string[]
    },
    blocked_tokens: string[],
    blocked_words: string[],
    zalgo: boolean
}

export interface CensorSettings {
    rules: CensorRule[]
}