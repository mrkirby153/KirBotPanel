import {CommandReducerState} from "./commands/reducer";
import {PermissionReducerState} from "./permissions/reducer";
import {RootReducerState} from "./reducer";
import {GeneralReducerState} from "./general/reducer";
import {InfractionReducerState} from "./infractions/reducer";
import {SpamReducerState} from "./spam/reducer";

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

export interface RootStore {
    app: RootReducerState,
    commands: CommandReducerState,
    permissions: PermissionReducerState,
    general: GeneralReducerState,
    infractions: InfractionReducerState,
    spam: SpamReducerState,
}