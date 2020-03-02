import React from 'react';
import {useGuildSetting} from "../utils/hooks";
import Field from "../../Field";
import {DashboardSelect} from "../../DashboardInput";

const AlertSettings: React.FC = () => {
    const [enabled] = useGuildSetting(window.Panel.Server.id, 'anti_raid_enabled', false);

    const [role, setRole] = useGuildSetting(window.Panel.Server.id, 'anti_raid_alert_role', '', true);
    const [channel, setChannel] = useGuildSetting(window.Panel.Server.id, 'anti_raid_alert_channel', '', true);

    let channels = window.Panel.Server.channels.filter(e => e.type == 'TEXT').map(chan => {
        return <option key={chan.id} value={chan.id}>#{chan.channel_name}</option>
    });
    let roles = window.Panel.Server.roles.filter(e => e.id != e.server_id).map(role => {
        return <option key={role.id} value={role.id}>{role.name}</option>
    });

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <div className="form-row">
                        <div className="col-6">
                            <Field help="The role to ping when a potential raid is detected">
                                <label htmlFor="anti-raid-alert-role"><b>Alert Role</b></label>
                                <DashboardSelect name="anti-raid-alert-role" className="form-control"
                                                 disabled={!enabled} value={role}
                                                 onChange={e => setRole(e.target.value)}>
                                    <option value={''}>None</option>
                                    {roles}
                                    <option value={'@here'}>@here</option>
                                    <option value={'@everyone'}>@everyone</option>
                                </DashboardSelect>
                            </Field>
                        </div>
                        <div className="col-6">
                            <Field help="The channel where the raid alert will be sent">
                                <label htmlFor="anti-raid-alert-channel"><b>Alert Channel</b></label>
                                <DashboardSelect name="anti-raid-alert-channel" className="form-control"
                                                 disabled={!enabled} value={channel}
                                                 onChange={e => setChannel(e.target.value)}>
                                    <option value={''}>None</option>
                                    {channels}
                                </DashboardSelect>
                            </Field>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default AlertSettings;