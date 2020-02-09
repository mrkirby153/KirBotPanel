export interface Infraction {
    active: number,
    inf_created_at: string,
    discriminator: number,
    expires_at: string | null,
    guild: string,
    inf_id: number,
    issuer: string,
    metadata: null,
    mod_discrim: number,
    mod_id: string,
    mod_username: string,
    reason: string,
    type: string,
    user_id: string | null,
    username: string | null
}

export interface PaginatedInfractionData {
    current_page: number,
    data: Infraction[],
    first_page_url: string,
    from: number,
    last_page: number,
    last_page_url: string,
    next_page_url: string,
    path: string,
    per_page: string,
    prev_page_url: string,
    to: number,
    total: number
}

export interface InfractionPaginationPayload {
    filtered: {
       id: string,
       value: string
    }[]
    sorted: {
        id: string,
        desc: boolean
    }[],
    page: number,
    page_size: number
}