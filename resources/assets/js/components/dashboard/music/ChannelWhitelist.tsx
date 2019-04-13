import React, {Component} from 'react';
import SettingsRepository from "../../../settings_repository";
import _ from 'lodash';


interface ChannelWhitelistChannelProps {
    channels: string[]
}

class ChannelWhitelistChannels extends Component<{}, ChannelWhitelistChannelProps> {
    constructor(props) {
        super(props);

        this.state = {
            channels: SettingsRepository.getSetting('music_channels', [])
        };

        this.getChannels = this.getChannels.bind(this);
        this.removeChannel = this.removeChannel.bind(this);
        this.addChannel = this.addChannel.bind(this);
    }

    getChannels(): { id: string, name: string }[] {
        return this.state.channels.map(chan => {
            let c = _.find(window.Panel.Server.channels, {id: chan}) as Channel;
            if (c == null) {
                return {
                    id: chan,
                    name: 'deleted-channel'
                }
            } else {
                return {
                    id: chan,
                    name: c.channel_name
                }
            }
        })
    }

    removeChannel(id) {
        let channels = _.without(this.state.channels, id);
        this.setState({
            channels: channels
        });
        SettingsRepository.setSetting('music_channels', channels, true);
    }

    addChannel(e) {
        let {value} = e.target;
        let channels = [...this.state.channels];
        channels.push(value);
        this.setState({
            channels: channels
        });
        SettingsRepository.setSetting('music_channels', channels, true);
    }

    render() {
        let availableChannels = window.Panel.Server.channels.filter(c => c.type == 'VOICE' && this.state.channels.indexOf(c.id) == -1).map(c => {
            return <option key={c.id} value={c.id}>{c.channel_name}</option>
        });
        let activeChannels = this.getChannels().map(c => {
            return <div key={c.id} className="channel">{c.name} <span className="x-icon"
                                                                      onClick={() => this.removeChannel(c.id)}><i
                className="fas fa-times"/></span>
            </div>
        });
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <label><b>Add Channel</b></label>
                        <select className="form-control" value={''} onChange={this.addChannel}>
                            <option value={''} disabled={true}>Select a channel</option>
                            {availableChannels}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="channel-whitelist">
                            {activeChannels}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default class ChannelWhitelist extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <h2>Channel Whitelist/Blacklist</h2>
                    <div className="form-row">
                        <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                                <label><b>Mode</b></label>
                                <select className="form-control">
                                    <option value={'OFF'}>Off</option>
                                    <option value={'WHITELIST'}>Whitelist</option>
                                    <option value={'Blacklist'}>Blacklist</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <ChannelWhitelistChannels/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}