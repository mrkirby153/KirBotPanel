import '../../../globals';
export interface Channel {
    id: string,
    server: string,
    channel_name: string,
    type: 'TEXT' | 'VOICE',
    hidden: number,
    created_at: string,
    updated_at: string
}