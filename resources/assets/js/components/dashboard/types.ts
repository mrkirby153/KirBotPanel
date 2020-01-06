export interface SetSettingAction {
    guild: string,
    key: string,
    value: any,
    persist: boolean
}