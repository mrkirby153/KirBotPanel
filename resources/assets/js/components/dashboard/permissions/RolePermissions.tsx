import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from './actions';
import {RoleClearance} from "./types";
import {DashboardInput, DashboardSelect} from "../../DashboardInput";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ConfirmButton from "../../ConfirmButton";
import Field from "../../Field";
import {useReduxListener} from "../utils/hooks";
import {getType} from "typesafe-actions";

interface AddingComponentProps {
    onClose(): void
}

const AddingComponent: React.FC<AddingComponentProps> = (props) => {
    const dispatch = useDispatch();

    const [clearance, setClearance] = useState(0);
    const [roleId, setRoleId] = useState("");
    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(Actions.createRoleClearance(roleId, clearance));
    };

    const existingPermissions: string[] = useSelector(state => state.permissions.roleClearances).map(role => role.role_id);

    useReduxListener(getType(Actions.createRoleClearanceOk), () => {
        props.onClose();
    });

    const roleSelections = window.Panel.Server.roles.filter(role => existingPermissions.indexOf(role.id) == -1 && role.name != "@everyone").map(role => {
        return <option value={role.id} key={role.id}>{role.name}</option>
    });

    return (
        <th colSpan={3}>
            <form onSubmit={onFormSubmit}>
                <div className="form-row">
                    <div className="col-md-3">
                        <Field>
                            <label htmlFor="roleId">Role</label>
                            <DashboardSelect className="form-control" name="roleId" value={roleId}
                                             onChange={e => setRoleId(e.target.value)}>
                                <option value={""} disabled>Select a role</option>
                                {roleSelections}
                            </DashboardSelect>
                        </Field>
                    </div>
                    <div className="col-md-3">
                        <Field>
                            <label htmlFor="clearance">Clearance</label>
                            <DashboardInput type="number" className="form-control" name="clearance" value={clearance}
                                            onChange={e => setClearance(parseInt(e.target.value))}/>
                        </Field>
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-12">
                        <div className="btn-group">
                            <button className="btn btn-success" type="submit"><FontAwesomeIcon icon={"check"}/> Save
                            </button>
                            <button className="btn btn-warning" type="button" onClick={() => props.onClose()}>
                                <FontAwesomeIcon icon={"times"}/> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </th>
    )
};

const RolePermissions: React.FC = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Actions.getRoleClearance())
    }, []);

    const permissions: RoleClearance[] = useSelector(store => store.permissions.roleClearances);

    const [adding, setAdding] = useState(false);

    let permissionElements = permissions.map(permission => {
        return (
            <tr key={permission.id}>
                <td>{permission.role_id} ({permission.name})</td>
                <td>
                    <DashboardInput type="number" className="form-control" name={permission.id}
                                    value={permission.permission_level}
                                    onChange={e => dispatch(Actions.modifyRoleClearance(permission.id, parseInt(e.target.value)))}/>
                </td>
                <td>
                    <ConfirmButton className="btn btn-danger" disabled={window.Panel.Server.readonly} onConfirm={() => {
                        dispatch(Actions.deleteRoleClearance(permission.id))
                    }}><FontAwesomeIcon icon={"times"}/> Delete</ConfirmButton>
                </td>
            </tr>
        )
    });

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <h1>Role Permissions</h1>
                    The below table controls clearance level for roles. If a user has multiple roles, their effective
                    clearance will be of the highest clearance level.
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table mt-2">
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">Role</th>
                                <th scope="col">Clearance Level</th>
                                <th scope="col">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {permissionElements}
                            </tbody>
                            <tfoot>
                            <tr>
                                {adding ? <AddingComponent onClose={() => setAdding(false)}/> :
                                    <button className="btn btn-success" onClick={() => setAdding(true)}><FontAwesomeIcon
                                        icon={"plus"}/> Add</button>}
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};
export default RolePermissions