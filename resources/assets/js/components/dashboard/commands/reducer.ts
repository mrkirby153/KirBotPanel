import {Reducer} from 'redux';
import * as Actions from './actions';
import {ActionType, getType} from "typesafe-actions";
import {CustomCommand} from "./types";
import ld_findIndex from 'lodash/findIndex';
import {JsonRequestErrors} from "../types";

export interface CommandReducerState {
    commands: CustomCommand[],
    aliases: CommandAlias[],
    saveCommandInProg: boolean,
    saveCommandErrors: JsonRequestErrors
}

const defaultState: CommandReducerState = {
    commands: [],
    aliases: [],
    saveCommandInProg: false,
    saveCommandErrors: {
        message: '',
        errors: {}
    }
};

export type CommandAction = ActionType<typeof Actions>

const reducer: Reducer<CommandReducerState, CommandAction> = (state = defaultState, action: CommandAction) => {
    switch (action.type) {
        case getType(Actions.clearSaveErrors):
            return {
                ...state,
                saveCommandErrors: {
                    message: '',
                    errors: {}
                }
            };
        case getType(Actions.saveCustomCommand):
            return {
                ...state,
                saveCommandInProg: true
            };
        case getType(Actions.deleteCustomCommand):
            return {
                ...state,
                commands: state.commands.filter(cmd => cmd.id != action.payload)
            };
        case getType(Actions.saveCustomCommandOk):
            // Replace the command
            const commands = [...state.commands];
            const idx = ld_findIndex(commands, {id: action.payload.id});
            if (idx != -1) {
                commands.splice(idx, 1, action.payload);
            } else {
                commands.push(action.payload);
            }
            return {
                ...state,
                saveCommandInProg: false,
                commands
            };
        case getType(Actions.saveCustomCommandFail):
            return {
                ...state,
                saveCommandInProg: false,
                saveCommandErrors: action.payload
            };
        case getType(Actions.getCustomCommandsOk):
            return {
                ...state,
                commands: action.payload
            };
        case getType(Actions.getCommandAliasesOk):
            return {
                ...state,
                aliases: action.payload
            };
        case getType(Actions.createCommandAliasOk):
            return {
                ...state,
                aliases: [...state.aliases, action.payload]
            };
        case getType(Actions.deleteCommandAlias):
            return {
                ...state,
                aliases: state.aliases.filter(alias => alias.id != action.payload)
            };
        default:
            return state
    }
};
export default reducer;