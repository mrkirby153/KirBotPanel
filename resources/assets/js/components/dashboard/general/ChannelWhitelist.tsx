import React from 'react';
import {DashboardSelect} from "../../DashboardInput";
import {useGuildSetting} from "../utils/hooks";
import ld_without from 'lodash/without';
import ld_find from 'lodash/find';
import ld_indexOf from 'lodash/indexOf';


const ChannelWhitelist: React.FC = () => {

    const [channels, setChannels] = useGuildSetting<string[]>(window.Panel.Server.id, 'cmd_whitelist', [], true);

    const addChannel = (e) => {
        let newChannels = [...channels, e.target.value];
        setChannels(newChannels);
    };

    const removeChannel = (id: string) => {
        setChannels(ld_without(channels, id))
    };

    const localizedChannels = channels.map(chan => ld_find(window.Panel.Server.channels, {id: chan})).filter(e => e != null) as Channel[];

    const channelSelect = window.Panel.Server.channels.filter(chan => chan.type == "TEXT" && ld_indexOf(channels, chan.id) == -1).map(channel => {
        return <option key={channel.id} value={channel.id}>#{channel.channel_name}</option>
    });

    const whitelistedChannels = localizedChannels.map(chan => {
        return (
            <div className="channel" key={chan.id}>
                #{chan.channel_name} {!window.Panel.Server.readonly &&
            <span className="x-icon" onClick={() => removeChannel(chan.id)}><i className="fas fa-times"/></span>}
            </div>
        )
    });

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <h2>Channel Whitelist</h2>
                    <p>
                        Channels specified here are the only channels that bot commands can be run in. The bot will
                        ignore
                        most commands in any other channel. Most moderation commands can be run anywhere. <br/>
                        <em>Leave blank to disable the whitelist</em>
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <div className="channel-whitelist">
                        {whitelistedChannels}
                    </div>
                </div>
                <div className="col-6">
                    <DashboardSelect className="form-control" value={""} onChange={addChannel}>
                        <option disabled value={""}>Add a channel</option>
                        {channelSelect}
                    </DashboardSelect>
                </div>
            </div>
        </React.Fragment>
    )
};
export default ChannelWhitelist;