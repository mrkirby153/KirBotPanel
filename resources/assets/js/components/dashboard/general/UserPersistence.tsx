import React, {Component, ReactElement} from 'react';
import Switch from "../../Switch";
import Field from "../../Field";
import SettingsRepository from "../../../settings_repository";
import _ from 'lodash';


interface PersistState {
    roles: string[],
    mode: number
}

export default class UserPersistence extends Component<{}, PersistState> {
    constructor(props) {
        super(props);
        this.state = {
            roles: SettingsRepository.getSetting("persist_roles", []),
            mode: SettingsRepository.getSetting("user_persistence", 0)
        };

        this.handleChange = this.handleChange.bind(this);
        this.localizedRoles = this.localizedRoles.bind(this);
        this.removeRole = this.removeRole.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
    }

    handleChange(e) {
        let role = e.target.value;
        let roles = [...this.state.roles];
        roles.push(role);
        this.setState({
            roles: roles
        });
        SettingsRepository.setSetting("persist_roles", roles, true);
    }

    handleChecked(e) {
        let newMode = this.state.mode;
        let target = e.target;
        if(target.dataset.mode == "1" && !target.checked) {
            newMode = 0;
        } else {
            if (target.checked) {
                newMode |= 1;
                newMode |= target.dataset.mode
            } else {
                newMode &= ~target.dataset.mode
            }
        }
        this.setState({
            mode: newMode
        });
        SettingsRepository.setSetting("user_persistence", newMode, true);
    }

    removeRole(id: string) {
        let newRoles = _.without(this.state.roles, id);
        this.setState({
            roles: newRoles
        });
        SettingsRepository.setSetting("persist_roles", newRoles, true);
    }

    localizedRoles(): Role[] {
        let arr = this.state.roles.map(fn => _.find(window.Panel.Server.roles, {id: fn})).filter(e => e != null);
        return arr as Role[]
    }

    render() {
        let persistenceEnabled = (this.state.mode & 1) > 0 && (this.state.mode & 16) > 0;
        let selectRoles: ReactElement[] = [];
        window.Panel.Server.roles.forEach(role => {
            if (_.indexOf(this.state.roles, role.id) != -1 || role.name == "@everyone") {
                return;
            }
            selectRoles.push(<option value={role.id} key={role.id}>{role.name}</option>)
        });

        let persistRoles: ReactElement[] = [];
        this.localizedRoles().forEach(role => {
            persistRoles.push(<div className="role" key={role.id}>{role.name} <span
                onClick={e => this.removeRole(role.id)}><i className="fas fa-times x-icon"/></span>
            </div>)
        });

        if (this.state.roles.length == 0) {
            persistRoles.push(<div className="role" key={"no_roles"}><i>All roles</i></div>)
        }

        if(!persistenceEnabled) {
            persistRoles = [<div className="role" key={"disabled"}><i>Role persistence is disabled.</i></div> ]
        }

        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h2>User Persistence</h2>
                        <p>
                            When enabled, users' roles, nicknames, and voice state will be restored on join. This
                            does <b>NOT</b> affect per-channel overrides
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <Switch label="Enable Persistence" id="enablePersistence" data-mode="1" checked={(this.state.mode & 1) > 0} onChange={this.handleChecked}/>
                        <div className="mt-1">
                            <Switch label="Persist Mute" id="persistMute" switchSize="small" data-mode="2" checked={(this.state.mode & 2) > 0} onChange={this.handleChecked}/>
                            <Switch label="Persist Roles" id="persistRoles" switchSize="small" data-mode="16" checked={(this.state.mode & 16) > 0} onChange={this.handleChecked}/>
                            <Switch label="Persist Deafen" id="persistDeafen" switchSize="small" data-mode="4" checked={(this.state.mode & 4) > 0} onChange={this.handleChecked}/>
                            <Switch label="Persist Nickname" id="persistNick" switchSize="small" data-mode="8" checked={(this.state.mode & 8) > 0} onChange={this.handleChecked}/>
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <p>
                            The following roles are persistent roles. These roles will be restored to the user when they
                            re-join.<br/>
                            If no roles are selected, all roles will persist.
                        </p>
                        <Field>
                            <select className="form-control" value={""} onChange={this.handleChange} disabled={!persistenceEnabled}>
                                <option value={""} disabled={true}>Persist a role</option>
                                {selectRoles}
                            </select>
                        </Field>

                        <div className="roles">
                            {persistRoles}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}