import React, {FormEvent, useEffect, useState} from 'react';
import {RootStateOrAny, useDispatch, useSelector} from 'react-redux';
import * as Actions from './actions';
import {CustomCommand} from "./types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ConfirmButton from "../../ConfirmButton";
import Modal from "../../Modal";
import Form from "../../Form";
import Field from "../../Field";
import {DashboardInput, DashboardSwitch} from "../../DashboardInput";
import {useReduxListener} from "../utils/hooks";
import {getType} from "typesafe-actions";
import {JsonRequestErrors, RootStore} from "../types";

const CustomCommands: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Actions.getCustomCommands())
    }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [commandName, setCommandName] = useState('');
    const [commandResponse, setCommandResponse] = useState('');
    const [respectWhitelist, setRespectWhitelist] = useState(false);
    const [clearance, setClearance] = useState(0);

    const commands: CustomCommand[] = useSelector((state: RootStore)  => state.commands.commands);

    const saving: boolean = useSelector((state: RootStore) => state.commands.saveCommandInProg);
    const errors: JsonRequestErrors = useSelector((state: RootStore) => state.commands.saveCommandErrors);

    // Close the modal if the command saved successfully
    useReduxListener(getType(Actions.saveCustomCommandOk), () => setModalOpen(false));

    const onModalClose = () => {
        setModalOpen(false);
    };

    const editCommand = (command: CustomCommand) => {
        dispatch(Actions.clearSaveErrors());
        setEditingId(command.id);
        setCommandName(command.name);
        setCommandResponse(command.data);
        setRespectWhitelist(command.respect_whitelist);
        setClearance(command.clearance_level);
        setModalOpen(true);
    };

    const addCommand = () => {
        dispatch(Actions.clearSaveErrors());
        setEditingId(null);
        setCommandName('');
        setCommandResponse('');
        setRespectWhitelist(false);
        setClearance(0);
        setModalOpen(true);
    };


    const commandElements = commands.map(command => {
        return (
            <tr key={command.id}>
                <td>{command.name}</td>
                <td>{command.data}</td>
                <td>{command.clearance_level}</td>
                <td>
                    <div className="btn-group">
                        <button className="btn btn-sm btn-info" disabled={window.Panel.Server.readonly}
                                onClick={() => editCommand(command)}>
                            <FontAwesomeIcon icon={"pen"}/>
                        </button>
                        <ConfirmButton className="btn btn-sm btn-danger" onConfirm={() => {
                            dispatch(Actions.deleteCustomCommand(command.id))
                        }} confirmText={<FontAwesomeIcon icon={"check"}/>}>
                            <FontAwesomeIcon icon={"times"}/>
                        </ConfirmButton>
                    </div>
                </td>
            </tr>
        )
    });

    const save = (e: FormEvent) => {
        e.preventDefault();
        dispatch(Actions.clearSaveErrors());
        dispatch(Actions.saveCustomCommand({
            id: editingId,
            name: commandName,
            data: commandResponse,
            clearance_level: clearance,
            respect_whitelist: respectWhitelist
        }))
    };


    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <h2>Custom Commands</h2>
                    <p>
                        The table below is all the commands registered on the server
                    </p>
                    <div className="table-responsive">
                        <table className="table mt-1 table-bordered table-hover">
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Response</th>
                                <th scope="col">Clearance</th>
                                <th scope="col">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {commandElements}
                            </tbody>
                            {!window.Panel.Server.readonly && <tfoot>
                            <tr>
                                <td colSpan={4}>
                                    <button className="btn btn-success" onClick={addCommand}>
                                        <FontAwesomeIcon icon={"plus"}/> New Command
                                    </button>
                                </td>
                            </tr>
                            </tfoot>}
                        </table>
                    </div>
                </div>
            </div>
            <Modal title={(editingId ? 'Edit' : 'Add') + ' Command'} open={modalOpen} onClose={onModalClose}>
                <Form busy={saving} onSubmit={save}>
                    <Field help="The command's name" errors={errors.errors['name']}>
                        <label>Command Name</label>
                        <DashboardInput type="text" className="form-control" name="command_name" value={commandName}
                                        onChange={e => setCommandName(e.target.value)} required/>
                    </Field>
                    <Field help="Respect the command whitelist" errors={errors.errors['respect_whitelist']}>
                        <DashboardSwitch label="Respect Whitelist" id="respectWhitelist" checked={respectWhitelist}
                                         onChange={e => setRespectWhitelist(e.target.checked)}/>
                    </Field>
                    <Field help="What the command returns when executed" errors={errors.errors['description']}>
                        <textarea className="form-control" name="command_response" value={commandResponse}
                                  onChange={e => setCommandResponse(e.target.value)} required/>
                    </Field>
                    <Field errors={errors.errors['clearance']}>
                        <label>Clearance</label>
                        <DashboardInput type="number" min={0} className="form-control" name="clearance" required
                                        value={clearance} onChange={e => setClearance(parseInt(e.target.value))}/>
                    </Field>
                    <div className="btn-group float-right">
                        <button type="button" className="btn btn-danger" onClick={() => setModalOpen(false)}>
                            <FontAwesomeIcon icon={"times"}/> Cancel
                        </button>
                        <button type="submit" className="btn btn-primary"><FontAwesomeIcon icon={"save"}/> Save</button>
                    </div>
                </Form>
            </Modal>
        </React.Fragment>
    )
};
export default CustomCommands;