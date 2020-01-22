import {createAction} from "typesafe-actions";
import {CreateCommandAliasPayload, CustomCommand, CustomCommandPayload} from "./types";

export const getCustomCommands = createAction('COMMANDS/GET_CUSTOM_COMMANDS')();
export const getCustomCommandsOk = createAction('COMMANDS/GET_CUSTOM_COMMANDS_OK', (data: CustomCommand[]) => data)();

export const saveCustomCommand = createAction('COMMANDS/ADD_CUSTOM_COMMAND', (data: CustomCommandPayload) => data)();
export const saveCustomCommandOk = createAction('COMMANDS/SAVE_CUSTOM_COMMAND_OK', (cmd: CustomCommand) => cmd)();
export const saveCustomCommandFail = createAction('COMMANDS/SAVE_CUSTOM_COMMAND_FAIL', (errors: any) => errors)();
export const clearSaveErrors = createAction('COMMANDS/CLEAR_SAVE_ERRORS')();

export const deleteCustomCommand = createAction('COMMANDS/DELETE_CUSTOM_COMMAND', (id: string) => id)();

export const getCommandAliases = createAction('COMMANDS/GET_ALIASES')();
export const getCommandAliasesOk = createAction('COMMANDS/GET_ALIASES_OK', (data: CommandAlias[]) => data)();
export const createCommandAlias = createAction('COMMANDS/CREATE_ALIAS', (data: CreateCommandAliasPayload) => data)();
export const createCommandAliasOk = createAction('COMMANDS/CREATE_ALIAS_OK', (data: CommandAlias) => data)();

export const deleteCommandAlias = createAction('COMMANDS/DELETE_ALIAS', (id: string) => id)();