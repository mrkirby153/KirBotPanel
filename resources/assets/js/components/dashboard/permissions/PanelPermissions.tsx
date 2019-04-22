import React, {Component, ReactElement} from 'react';
import axios from 'axios';
import _ from 'lodash';
import Field from "../../Field";
import {DashboardInput, DashboardSelect} from "../../DashboardInput";


interface PanelPermissionState {
    permissions: PanelPermission[],
    create_id: string | null,
    adding: boolean
}

interface AddingComponentProps {
    onSubmit: Function,
    onCancel: Function
}

interface AddingComponentState {
    id: string,
    permission: '' | "EDIT" | "VIEW" | "ADMIN",
    id_error: string | null
}

class AddingComponent extends Component<AddingComponentProps, AddingComponentState> {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            permission: '',
            id_error: null
        };

        this.updateId = this.updateId.bind(this);
        this.updatePermission = this.updatePermission.bind(this);
        this.submit = this.submit.bind(this);
    }

    updateId(e) {
        let {value} = e.target;
        this.setState({
            id: value,
            id_error: null
        })
    }

    updatePermission(e) {
        let {value} = e.target;

        this.setState({
            permission: value
        });
    }

    submit(e) {
        e.preventDefault();
        if (this.state.id.match(/^\d+$/)) {
            if (this.state.id.match(/^\d{17,18}$/)) {
                this.props.onSubmit({
                    id: this.state.id,
                    permission: this.state.permission
                });
            } else {
                this.setState({
                    id_error: 'ID must be a valid user ID'
                })
            }
        } else {
            this.setState({
                id_error: 'ID must be a number'
            })
        }
    }


    render() {
        return (
            <tr>
                <th colSpan={3}>
                    <form onSubmit={this.submit}>
                        <div className="form-row">
                            <div className="col-md-3">
                                <Field errors={this.state.id_error}>
                                    <label htmlFor="userId">User ID</label>
                                    <DashboardInput type="text" name="userId" className="form-control" id="userId"
                                                    required
                                                    onChange={this.updateId} value={this.state.id}/>
                                </Field>
                            </div>
                            <div className="col-md-3">
                                <Field>
                                    <label htmlFor="permissions">Permission</label>
                                    <DashboardSelect className="form-control" id="permissions" name="permissions"
                                                     required
                                                     onChange={this.updatePermission} value={this.state.permission}>
                                        <option value={''} disabled>Select an Option</option>
                                        <option value={"VIEW"}>View</option>
                                        <option value={"EDIT"}>Edit</option>
                                        <option value={"ADMIN"}>Admin</option>
                                    </DashboardSelect>
                                </Field>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-12">
                                <div className="btn-group">
                                    <button className="btn btn-success" type="submit"><i className="fas fa-check"/> Save
                                    </button>
                                    <button className="btn btn-warning" type="button"
                                            onClick={e => this.props.onCancel(e)}><i
                                        className="fas fa-times"/> Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </th>
            </tr>
        );
    }

}

export default class PanelPermissions extends Component<{}, PanelPermissionState> {

    constructor(props) {
        super(props);

        this.state = {
            permissions: [],
            create_id: null,
            adding: false
        };

        this.retrievePanelPermissions = this.retrievePanelPermissions.bind(this);
        this.changePanelPermissions = this.changePanelPermissions.bind(this);
        this.deletePanelPermission = this.deletePanelPermission.bind(this);
        this.createNewPermissions = this.createNewPermissions.bind(this);
        this.toggleAdding = this.toggleAdding.bind(this);
    }

    componentDidMount(): void {
        this.retrievePanelPermissions()
    }

    retrievePanelPermissions() {
        axios.get('/api/guild/' + window.Panel.Server.id + '/permissions/panel').then(resp => {
            this.setState({
                permissions: resp.data
            })
        })
    }

    deletePanelPermission(id) {
        axios.delete('/api/guild/' + window.Panel.Server.id + '/permissions/panel/' + id).then(() => {
            let newState = [...this.state.permissions].filter(e => e.id != id);
            this.setState({
                permissions: newState
            })
        });

    }

    changePanelPermissions(id, evt) {
        let {value} = evt.target;
        axios.patch('/api/guild/' + window.Panel.Server.id + '/permissions/panel/' + id, {
            permission: value
        }).then(() => {
            let oldState = [...this.state.permissions];

            let idx = _.findIndex(oldState, {id: id});
            if (idx == -1) {
                console.warn("Attempting to modify the permissions for an id that doesn't exist")
                return;
            }
            oldState[idx].permission = value;
            this.setState({
                permissions: oldState
            });
        });
    }

    toggleAdding(value) {
        this.setState({
            adding: value
        })
    }

    createNewPermissions(id, permission) {
        if (_.indexOf(this.state.permissions.map(p => p.user_id), id) != -1) {
            this.toggleAdding(false);
            return;
        }
        axios.put('/api/guild/' + window.Panel.Server.id + '/permissions/panel', {
            id: id,
            permission: permission
        }).then(resp => {
            let perms = [...this.state.permissions];
            perms.push(resp.data);
            this.setState({
                permissions: perms
            });
            this.toggleAdding(false);
        })
    }

    render() {
        let panelPermissions: ReactElement[] = [];
        this.state.permissions.forEach(perm => {
            let ownUser = window.Panel.user && perm.user_id == window.Panel.user.id;
            if(window.Panel.user && window.Panel.user.admin == 1)
                ownUser = false;
            let userString = <span className="user">{perm.user_id} {perm.user ? '(' + perm.user + ')' : ''}</span>
            panelPermissions.push(
                <tr key={perm.id}>
                    <td>{userString}</td>
                    <td>
                        <DashboardSelect className="form-control" value={perm.permission}
                                         onChange={e => this.changePanelPermissions(perm.id, e)} disabled={ownUser && !window.Panel.Server.owner || !window.Panel.Server.admin}>
                            <option value={"VIEW"}>View</option>
                            <option value={"EDIT"}>Edit</option>
                            <option value={"ADMIN"}>Admin</option>
                        </DashboardSelect>
                    </td>
                    <td>
                        <button className="btn btn-danger" onClick={() => this.deletePanelPermission(perm.id)}
                                disabled={window.Panel.Server.readonly || (ownUser && !window.Panel.Server.owner) || !window.Panel.Server.admin}><i
                            className="fas fa-times"/> Delete
                        </button>
                    </td>
                </tr>
            )
        });
        return (
            <div>
                <h1>Panel Permissions</h1>
                <p>
                    Configure permissions for users here. <br/>
                    <em>The server owner always has admin permissions, regardless of what is set below</em>
                </p>
                <div>
                    <b>Admin: </b>Full access to the panel, can edit and add new users<br/>
                    <b>Edit: </b>Can edit settings, but cannot add new users <br/>
                    <b>View: </b>View only access
                </div>

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
                        {panelPermissions}
                        </tbody>
                        <tfoot>
                        {this.state.adding ? <AddingComponent onSubmit={e => {
                                this.createNewPermissions(e.id, e.permission)
                            }} onCancel={() => {
                                this.toggleAdding(false)
                            }}/> :
                            (!window.Panel.Server.readonly && window.Panel.Server.admin) &&
                           <tr><th colSpan={3}><button className="btn btn-success" onClick={e => this.toggleAdding(true)}><i
                                className="fas fa-plus"/> Add
                           </button></th></tr>
                        }
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}