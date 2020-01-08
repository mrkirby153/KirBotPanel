import React, {ReactElement} from 'react';
import {DashboardSelect} from "../../DashboardInput";
import ld_indexOf from 'lodash/indexOf';
import ld_find from 'lodash/find';
import ld_without from 'lodash/without';
import {useGuildSetting} from "../utils/hooks";
import Switch, {SwitchProps} from "../../Switch";

enum Persistence {
    Enabled = 1, Mute = 2, Deafen = 4, Nick = 8, Roles = 16
}

interface PersistenceToggleProps extends SwitchProps {
    mode: Persistence,
    field: number
}

const PersistenceToggle: React.FC<PersistenceToggleProps> = (props) => {
    let {mode, field, ...rest} = props;
    return <Switch data-mode={mode} checked={(field & mode) > 0} {...rest}/>
};
const UserPersistence: React.FC = () => {

    const [persistedRoles, setPersistedRoles] = useGuildSetting<string[]>(window.Panel.Server.id, 'persist_roles', [], true);
    const [persistMode, setPersistMode] = useGuildSetting(window.Panel.Server.id, 'user_persistence', 0, true);

    const availableRoles = window.Panel.Server.roles.filter(role => ld_indexOf(persistedRoles, role.id) == -1 && role.name != "@everyone").map(role => {
        return (
            <option value={role.id} key={role.id}>{role.name}</option>
        )
    });

    let rolePersistenceEnabled = (persistMode & Persistence.Enabled) > 0 && (persistMode & Persistence.Roles) > 0;

    const localizedRoles = persistedRoles.map(role => ld_find(window.Panel.Server.roles, {id: role})).filter(e => e != null) as Role[];

    const addPersistenceRole = (e) => {
        let roles = [e.target.value, ...persistedRoles];
        setPersistedRoles(roles);
    };

    const removePersistenceRole = (id: string) => {
        setPersistedRoles(ld_without(persistedRoles, id))
    };

    const handlePersistenceToggle = (e) => {
        let newMode = persistMode;
        let mode = e.target.dataset.mode as number;
        if (mode == Persistence.Enabled && !e.target.checked) {
            newMode = 0;
        } else {
            if (e.target.checked) {
                newMode |= Persistence.Enabled; // If we check any of the boxes, we want to enable persistence
                newMode |= mode;
            } else {
                newMode &= ~mode;
            }
        }
        setPersistMode(newMode);
    };

    const persistedRoleElements: ReactElement[] = [];
    if (!rolePersistenceEnabled) {
        persistedRoleElements.push(<div className="role" key={"disabled"}><i>Role persistence is disabled</i></div>)
    } else if (persistedRoles.length == 0) {
        persistedRoleElements.push(<div className="role" key={"none"}><i>All Roles</i></div>)
    } else {
        localizedRoles.forEach(role => {
            const el = (
                <div className="role" key={role.id}>
                    {role.name} {!window.Panel.Server.readonly &&
                <span onClick={e => removePersistenceRole(role.id)}><i className="fas fa-times x-icon"/></span>}
                </div>
            );
            persistedRoleElements.push(el)
        });
    }

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <h2>User Persistence</h2>
                    <p>
                        When enabled, users' roles, nicknames, and voice state will be restored on join. This
                        does <b>NOT</b> affect per channel overrides
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 col-md-12">
                    <PersistenceToggle label="Enable Persistence" id="enablePersistence" mode={Persistence.Enabled}
                                       field={persistMode} onClick={handlePersistenceToggle}/>
                    <div className="mt-1">
                        <PersistenceToggle label="Persist Mute" id="persistMute" switchSize="small"
                                           mode={Persistence.Mute} field={persistMode}
                                           onClick={handlePersistenceToggle}/>
                        <PersistenceToggle label="Persist Roles" id="persistRoles" switchSize="small"
                                           mode={Persistence.Roles} field={persistMode}
                                           onClick={handlePersistenceToggle}/>
                        <PersistenceToggle label="Persist Deafen" id="persistDeafen" switchSize="small"
                                           mode={Persistence.Deafen} field={persistMode}
                                           onClick={handlePersistenceToggle}/>
                        <PersistenceToggle label="Persist Nickname" id="persistNick" switchSize="small"
                                           mode={Persistence.Nick} field={persistMode}
                                           onClick={handlePersistenceToggle}/>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12">
                    <p>
                        The following roles are persistent roles. These roles will be restored to the user when
                        they re-join.<br/>
                        If no roles are selected, all roles will persist. The muted role is persistent and
                        cannot be changed
                    </p>
                    <DashboardSelect className="form-control" value={""} disabled={!rolePersistenceEnabled}
                                     onChange={addPersistenceRole}>
                        <option value={""} disabled={true}>Select a role...</option>
                        {availableRoles}
                    </DashboardSelect>
                    <div className="roles">
                        {persistedRoleElements}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default UserPersistence;