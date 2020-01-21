import React, {useEffect, useState} from 'react';
import ld_find from 'lodash/find';
import './styles.scss';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from './actions';
import {PanelPermission, PanelPermissionType} from "./types";
import {DashboardInput, DashboardSelect} from "../../DashboardInput";
import Field from "../../Field";
import ConfirmButton from "../../ConfirmButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getType} from "typesafe-actions";
import {useReduxListener} from "../utils/hooks";
import {RootStore} from "../types";
import {useTypedSelector} from "../reducers";

interface AddingComponentProps {
    onClose(e?: React.MouseEvent<HTMLButtonElement>): void
}

const AddingComponent: React.FC<AddingComponentProps> = (props) => {
    const dispatch = useDispatch();
    const [id, setId] = useState('');
    const [errors, setErrors] = useState<string | null>(null);
    const [permission, setPermission] = useState<PanelPermissionType>(PanelPermissionType.VIEW);
    const permissions: PanelPermission[] = useSelector((store: RootStore) => store.permissions.panelPermissions);

    useReduxListener(getType(Actions.createPanelPermissionOk), () => {
        props.onClose();
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (ld_find(permissions, {user_id: id}) != null) {
            setErrors('ID already has permissions set');
            return;
        }
        if (id.match(/^\d+$/)) {
            if (id.match(/^\d{17,18}$/)) {
                dispatch(Actions.createPanelPermission(id, permission));
            } else {
                setErrors('ID must be a valid snowflake');
            }
        } else {
            setErrors('ID must be a number');
        }
    };

    return (
        <tr>
            <th colSpan={3}>
                <form onSubmit={onSubmit}>
                    <div className="form-row">
                        <div className="col-md-3">
                            <Field errors={errors}>
                                <label htmlFor="userId">User ID</label>
                                <DashboardInput type="text" name="userId" className="form-control" id="userId"
                                                required value={id} onChange={e => setId(e.target.value)}/>
                            </Field>
                        </div>
                        <div className="col-md-3">
                            <Field>
                                <label htmlFor="permission">Permission</label>
                                <DashboardSelect className="form-control" id="permission" name="permission" required
                                                 value={permission}
                                                 onChange={e => setPermission(PanelPermissionType[e.target.value])}>
                                    <option value={''} disabled>Select an Option</option>
                                    <option value={PanelPermissionType.VIEW}>View</option>
                                    <option value={PanelPermissionType.EDIT}>Edit</option>
                                    <option value={PanelPermissionType.ADMIN}>Admin</option>
                                </DashboardSelect>
                            </Field>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <div className="btn-group">
                                <button className="btn btn-success" type="submit"><i className="fas fa-check"/> Save
                                </button>
                                <button className="btn btn-warning" type="button" onClick={props.onClose}><i
                                    className="fas fa-times"/> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </th>
        </tr>
    )
};

const PanelPermissions: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(Actions.getPanelPermissions())
    }, []);

    const permissions: PanelPermission[] = useTypedSelector(state => state.permissions.panelPermissions);
    const user: User | null = useTypedSelector(state => state.app.user);

    const [adding, setAdding] = useState(false);

    const deletePermission = (id: string) => {
        dispatch(Actions.deletePanelPermission(id));
    };

    const permissionElements = permissions.map(perm => {
        let ownUser = false;
        if(user) {
            ownUser = user.id == perm.user_id;
            if (user.admin) {
                ownUser = false;
            }
        }
        let userString = <span className="user">{perm.user_id} {perm.user && '(' + perm.user + ')'}</span>
        return (
            <tr key={perm.id}>
                <td>{userString}</td>
                <td>
                    <DashboardSelect className="form-control" value={perm.permission}
                                     disabled={(ownUser && !window.Panel.Server.owner) || (!window.Panel.Server.admin)}
                                     onChange={e => dispatch(Actions.modifyPanelPermission(perm.id, PanelPermissionType[e.target.value]))}>
                        <option value={PanelPermissionType.VIEW}>View</option>
                        <option value={PanelPermissionType.EDIT}>Edit</option>
                        <option value={PanelPermissionType.ADMIN}>Admin</option>
                    </DashboardSelect>
                </td>
                <td>
                    <ConfirmButton className="btn btn-danger"
                                   disabled={window.Panel.Server.readonly || (ownUser && !window.Panel.Server.owner) || !window.Panel.Server.admin}
                                   onConfirm={() => deletePermission(perm.id)}>
                        <FontAwesomeIcon icon={"times"}/> Delete
                    </ConfirmButton>
                </td>
            </tr>
        )
    });
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <h1>Panel Permissions</h1>
                    <p>
                        Configure permissions for users here. <br/>
                        <em>The server owner always has admin permissions, regardless of what is set below</em>
                    </p>
                    <ul className="permission-description">
                        <li><b>Admin: </b>Full access to the panel. Can edit and add new users</li>
                        <li><b>Edit </b>Can edit settings, but cannot add new users</li>
                        <li><b>View: </b>View only access. Cannot change any settings</li>
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table mt-2">
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">User</th>
                                <th scope="col">Permission</th>
                                <th scope="col">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {permissionElements}
                            </tbody>
                            <tfoot>
                            {adding ? <AddingComponent onClose={() => setAdding(false)}/> : <tr>
                                <th colSpan={3}>
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
export default PanelPermissions;