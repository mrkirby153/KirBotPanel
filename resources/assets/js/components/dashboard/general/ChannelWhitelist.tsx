import React, {Component, ReactElement} from 'react';
import Field from "../../Field";
import SettingsRepository from "../../../settings_repository";
import _ from 'lodash';
import {DashboardSelect} from "../../DashboardInput";


interface WhitelistState {
    whitelist: string[]
}

export default class ChannelWhitelist extends Component<{}, WhitelistState> {

    constructor(props) {
        super(props);
        this.state = {
            whitelist: SettingsRepository.getSetting("cmd_whitelist", [])
        };

        this.addChannel = this.addChannel.bind(this);
        this.localizeChannels = this.localizeChannels.bind(this);
        this.removeChannel = this.removeChannel.bind(this);
    }

    addChannel(e) {
        let channels = [...this.state.whitelist];
        channels.push(e.target.value);
        this.setState({
            whitelist: channels
        });
        SettingsRepository.setSetting('cmd_whitelist', channels, true);
    }

    removeChannel(id:string) {
        let newState = _.without(this.state.whitelist, id);
        this.setState({
            whitelist: newState
        });
        SettingsRepository.setSetting('cmd_whitelist', newState, true)
    }

    localizeChannels(): Channel[] {
        return this.state.whitelist.map(chan => {
            return _.find(window.Panel.Server.channels, {id: chan});
        }).filter(e => e != null) as Channel[];
    }

    render() {
        let channelSelect: ReactElement[] = [];
        window.Panel.Server.channels.filter(chan => chan.type == "TEXT")
            .filter(c => _.indexOf(this.state.whitelist, c.id) == -1).forEach(c => {
            channelSelect.push(<option key={c.id} value={c.id}>#{c.channel_name}</option>)
        });

        let whitelistChannels: ReactElement[] = [];
        this.localizeChannels().forEach(c => {
            whitelistChannels.push(
                <div className="channel" key={c.id}>
                    #{c.channel_name} {!window.Panel.Server.readonly && <span className="x-icon" onClick={_ => this.removeChannel(c.id)}><i className="fas fa-times"/></span>}
                </div>
            )
        });
        return (
            <div className="row">
                <div className="col-12">
                    <h2>Channel Whitelist</h2>
                    <p>
                        Channels specified here are the only channels that bot commands can be run in. The bot will
                        ignore most commands in any other channels.
                        <em>Leave blank to disable the whitelist</em>
                    </p>
                </div>
                <div className="col-6">
                    <div className="channel-whitelist">
                        {whitelistChannels}
                    </div>
                </div>
                <div className="col-6">
                    <Field>
                        <DashboardSelect className="form-control" value={""} onChange={this.addChannel}>
                            <option disabled value={""}>Add a channel</option>
                            {channelSelect}
                        </DashboardSelect>
                    </Field>
                </div>
            </div>
        );
    }

}