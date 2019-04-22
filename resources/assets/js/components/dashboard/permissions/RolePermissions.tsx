import React, {Component, ReactElement} from 'react';
import axios from 'axios';
import _ from 'lodash';
import Field from "../../Field";
import {DashboardInput, DashboardSelect} from "../../DashboardInput";


interface RolePermissionState {
    permissions: RoleClearance[],
    adding: boolean
}

interface AddingComponentProps {
    onSubmit: Function,
    onCancel: Function,
    toExclude: String[]
}

interface AddingComponentState {
    role: string,
    clearance: number
}

class AddingComponent extends Component<AddingComponentProps, AddingComponentState> {

    constructor(props) {
        super(props);
        this.state = {
            role: '',
            clearance: 0
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(evt) {
        let {name, value} = evt.target;
        // @ts-ignore
        this.setState({[name]: value});
    }

    onSubmit() {
        this.props.onSubmit(this.state);
    }

    render() {
        let roles: ReactElement[] = [];
        window.Panel.Server.roles.filter(role => _.indexOf(this.props.toExclude, role.id) == -1 && role.id != window.Panel.Server.id).forEach(role => {
            roles.push(<option key={role.id} value={role.id}>{role.name}</option>)
        });
        return (
            <th colSpan={3}>
                <form onSubmit={this.onSubmit}>
                    <div className="form-row">
                        <div className="col-md-3">
                            <Field>
                                <label htmlFor="roleId">Role</label>
                                <DashboardSelect className="form-control" value={this.state.role} name="role"
                                                 onChange={this.onChange}>
                                    <option value={""} disabled>Select a role</option>
                                    {roles}
                                </DashboardSelect>
                            </Field>
                        </div>
                        <div className="col-md-3">
                            <Field>
                                <label htmlFor="clearance">Clearance</label>
                                <DashboardInput type="number" className="form-control" value={this.state.clearance}
                                                name="clearance" onChange={this.onChange}/>
                            </Field>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <div className="btn-group">
                                <button className="btn btn-success" type="submit"><i
                                    className="fa fa-check"/> Save
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
        );
    }

}

export default class RolePermissions extends Component<{}, RolePermissionState> {
    constructor(props) {
        super(props);
        this.state = {
            permissions: [],
            adding: false
        };

        this.getRolePermissions = this.getRolePermissions.bind(this);
        this.saveRolePermissions = _.debounce(this.saveRolePermissions.bind(this), 300);
        this.modifyRolePermissions = this.modifyRolePermissions.bind(this);
        this.createRolePermissions = this.createRolePermissions.bind(this);
        this.deleteRolePermissions = this.deleteRolePermissions.bind(this);
        this.setAdding = this.setAdding.bind(this);
    }

    componentDidMount(): void {
        this.getRolePermissions();
    }

    getRolePermissions() {
        axios.get('/api/guild/' + window.Panel.Server.id + '/permissions/role').then(resp => {
            this.setState({
                permissions: resp.data
            })
        })
    }

    modifyRolePermissions(evt) {
        let {name, value} = evt.target;
        let roles = [...this.state.permissions];
        let idx = _.findIndex(roles, {id: name});
        if (idx == null) {
            return;
        }
        roles[idx].permission_level = value;
        this.setState({
            permissions: roles
        });
        this.saveRolePermissions(roles[idx].id);
    }

    saveRolePermissions(id) {
        let idx = _.findIndex(this.state.permissions, {id: id});
        if (idx == -1) {
            console.warn('Attempting to save a role permission that doesn\'t exist');
            return;
        }
        axios.patch('/api/guild/' + window.Panel.Server.id + '/permissions/role/' + id, {
            permission: this.state.permissions[idx].permission_level
        });
    }

    createRolePermissions(role, value) {
        axios.put('/api/guild/' + window.Panel.Server.id + '/permissions/role', {
            server: window.Panel.Server.id,
            role_id: role,
            permission_level: value
        }).then(resp => {
            let roles = [...this.state.permissions];
            roles.push(resp.data);
            this.setState({
                permissions: roles
            })
        });
    }

    deleteRolePermissions(id) {
        axios.delete('/api/guild/' + window.Panel.Server.id + '/permissions/role/' + id).then(resp => {
            let roles = [...this.state.permissions].filter(e => e.id != id);
            this.setState({
                permissions: roles
            })
        })
    }

    setAdding(val) {
        this.setState({
            adding: val
        })
    }

    render() {
        let permissions: ReactElement[] = [];
        this.state.permissions.forEach(perm => {
            permissions.push(
                <tr key={perm.id}>
                    <td>{perm.role_id} ({perm.name})</td>
                    <td>
                        <form onSubmit={e => e.preventDefault()}>
                            <Field>
                                <DashboardInput type="number" className="form-control" name={perm.id}
                                                value={perm.permission_level} onChange={this.modifyRolePermissions}
                                                onBlur={() => this.saveRolePermissions(perm.id)}/>
                            </Field>
                        </form>
                    </td>
                    <td>
                        <button className="btn btn-danger" onClick={() => this.deleteRolePermissions(perm.id)}
                                disabled={window.Panel.Server.readonly}><i
                            className="fas fa-times"/> Delete
                        </button>
                    </td>
                </tr>
            )
        });
        return (
            <div>
                <h1>Role Permissions</h1>
                The below tables controls clearance level for roles. If a user has multiple roles, their effective
                permission will be of the highest clearance level

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
                        {permissions}
                        </tbody>
                        <tfoot>
                        <tr>
                            {this.state.adding ? <AddingComponent onSubmit={e => {
                                this.createRolePermissions(e.role, e.clearance);
                                this.setAdding(false);
                            }} onCancel={() => {
                                this.setAdding(false);
                            }} toExclude={this.state.permissions.map(p => p.role_id)}/> : !window.Panel.Server.readonly && <th colSpan={3}>
                                <button className="btn btn-success" onClick={() => this.setAdding(true)}><i
                                    className="fas fa-plus"/> Add
                                </button>
                            </th>}
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}