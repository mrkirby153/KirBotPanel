import React, {FormEvent, ReactElement, useEffect, useState} from 'react';
import * as Actions from './actions';
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../reducers";
import ConfirmButton from "../../ConfirmButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Form from "../../Form";
import Field from "../../Field";
import {DashboardInput} from "../../DashboardInput";
import {useReduxListener} from "../utils/hooks";
import {getType} from "typesafe-actions";

interface AddingComponentProps {
    onClose(): void
}

const AddingComponent: React.FC<AddingComponentProps> = (props) => {

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [command, setCommand] = useState("");
    const [alias, setAlias] = useState("");
    const [clearance, setClearance] = useState(-1);

    useReduxListener(getType(Actions.createCommandAliasOk), () => {
        props.onClose();
    });

    const save = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        dispatch(Actions.createCommandAlias({
            command, alias, clearance
        }));
    };

    return (
        <tr>
            <th colSpan={4}>
                <Form busy={loading} onSubmit={save}>
                    <div className="form-row">
                        <div className="col-md-3">
                            <Field>
                                <label htmlFor="command">Command</label>
                                <DashboardInput type="text" name="command" className="form-control" required={true}
                                                value={command} onChange={e => setCommand(e.target.value)}/>
                            </Field>
                        </div>
                        <div className="col-md-3">
                            <Field>
                                <label htmlFor="alias">Alias</label>
                                <DashboardInput type="text" name="alias" className="form-control" value={alias}
                                                onChange={e => setAlias(e.target.value)}/>
                            </Field>
                        </div>
                        <div className="col-md-3">
                            <Field>
                                <label htmlFor="clearance">Clearance</label>
                                <DashboardInput type="number" min={-1} className="form-control" required={true}
                                                value={clearance}
                                                onChange={e => setClearance(parseInt(e.target.value))}/>
                            </Field>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="btn-group">
                            <button type="button" className="btn btn-warning" onClick={props.onClose}><FontAwesomeIcon
                                icon={"times"}/> Cancel
                            </button>
                            <button type="submit" className="btn btn-success"><FontAwesomeIcon icon={"save"}/> Create
                            </button>
                        </div>
                    </div>
                </Form>

            </th>
        </tr>
    )
};

const CommandAliases: React.FC = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Actions.getCommandAliases())
    }, []);

    const commandAliases = useTypedSelector(state => state.commands.aliases);

    const [adding, setAdding] = useState(false);

    const aliasElements = commandAliases.map(alias => {
        let commandEl: ReactElement | string = alias.command;
        let aliasEl: ReactElement | string = alias.alias || <i>None</i>;
        let clearanceEl: ReactElement | number = alias.clearance;

        if(alias.command == "*") {
            commandEl = <i>All Commands</i>;
            aliasEl =  "N/A"
        }
        if(alias.clearance == -1) {
            aliasEl = <i>Inherit</i>;
        }

        return (
            <tr key={alias.id}>
                <td>{commandEl}</td>
                <td>{aliasEl}</td>
                <td>{clearanceEl}</td>
                <td>
                    <div className="btn-group">
                        <ConfirmButton className="btn btn-danger" onConfirm={() => {
                            dispatch(Actions.deleteCommandAlias(alias.id))
                        }} confirmText={<FontAwesomeIcon icon={"check"}/>}>
                            <FontAwesomeIcon icon={"times"}/>
                        </ConfirmButton>
                    </div>
                </td>
            </tr>
        )
    });

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <h2>Command Aliases</h2>
                    <p>A list of all configured command aliases</p>

                    <div className="table-responsive">
                        <table className="table table-hover mt-2">
                            <thead className="thead-light">
                            <tr>
                                <th>Command</th>
                                <th>Alias</th>
                                <th>Clearance Override</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {aliasElements}
                            </tbody>
                            <tfoot>
                            {adding ?
                                <AddingComponent onClose={() => setAdding(false)}/> : !window.Panel.Server.readonly &&
                                <tr>
                                    <th colSpan={4}>
                                        <button className="btn btn-success" onClick={() => setAdding(true)}>
                                            <FontAwesomeIcon icon={"plus"}/> Add
                                        </button>
                                    </th>
                                </tr>}
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};
export default CommandAliases;