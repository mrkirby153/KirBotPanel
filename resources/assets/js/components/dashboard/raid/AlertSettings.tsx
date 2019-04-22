import React, {Component} from 'react';
import Field from "../../Field";
import SettingsRepository from "../../../settings_repository";

interface AlertSettingsState {
    anti_raid_alert_role: string,
    anti_raid_alert_channel: string
}

interface AlertSettingsProps {
    enabled: boolean
}

export default class AlertSettings extends Component<AlertSettingsProps, AlertSettingsState> {
    constructor(props) {
        super(props);

        this.state = SettingsRepository.getMultiple(['anti_raid_alert_role', 'anti_raid_alert_channel']);

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        let {name, value} = e.target;
        // @ts-ignore
        this.setState({
            [name]: value
        });
        SettingsRepository.setSetting(name, value, true);
    }

    render() {
        let channels = window.Panel.Server.channels.filter(e => e.type == 'TEXT').map(channel => {
            return <option key={channel.id}>#{channel.channel_name}</option>
        });
        let roles = window.Panel.Server.roles.filter(e => e.id != e.server_id).map(role => {
            return <option key={role.id} value={role.id}>{role.name}</option>
        });
        return(
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="form-row">
                            <div className="col-6">
                                <Field help="The role to ping when a potential raid is detected">
                                    <label htmlFor="anti_raid_alert_role"><b>Alert Role</b></label>
                                    <select name="anti_raid_alert_role" className="form-control" value={this.state.anti_raid_alert_role} onChange={this.onChange} disabled={!this.props.enabled}>
                                        <option value={''}>None</option>
                                        {roles}
                                        <option value={'@here'}>@here</option>
                                        <option value={'@everyone'}>@everyone</option>
                                    </select>
                                </Field>
                            </div>
                            <div className="col-6">
                                <Field help="The channel where the raid alert will be sent">
                                    <label htmlFor="anti_raid_alert_channel"><b>Alert Channel</b></label>
                                    <select name="anti_raid_alert_channel" className="form-control" value={this.state.anti_raid_alert_channel} onChange={this.onChange} disabled={!this.props.enabled}>
                                        {channels}
                                    </select>
                                </Field>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}