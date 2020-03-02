export interface Raid {
    timestamp: string,
    member_count: number,
    id: string,
    members: RaidMember[]
}

export interface RaidMember {
    name: string,
    id: string
}
