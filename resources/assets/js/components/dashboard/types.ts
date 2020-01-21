export interface SetSettingAction {
    guild: string,
    key: string,
    value: any,
    persist: boolean
}

export interface JsonRequestErrors {
    message: string,
    errors: {
        [key: string]: Array<string>
    }
}
