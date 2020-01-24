import React from 'react';
import {useGuildSetting} from "../utils/hooks";
import {DashboardSelect} from "../../DashboardInput";
import ld_find from 'lodash/find';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


enum WhitelistState {
    OFF = "OFF", WHITELIST = "WHITELIST", BLACKLIST = "BLACKLIST"
}

const ChannelWhitelistChannels: React.FC = () => {

    let [channels, setChannels] = useGuildSetting<Array<string>>(window.Panel.Server.id, 'music_channels', [], true);

    let addChannel = (chan: string) => {
        setChannels([...channels, chan]);
    };

    let removeChannel = (chan: string) => {
        setChannels(channels.filter(c => c != chan))
    };

    let availableChannels = window.Panel.Server.channels.filter(c => c.type == 'VOICE' && channels.indexOf(c.id) == -1).map(chan => {
        return <option key={chan.id} value={chan.id}>{chan.channel_name}</option>
    });

    let activeChannels = channels.map(chan => {
        let c = ld_find(window.Panel.Server.channels, {id: chan}) as Channel;
        return {id: chan, name: c.channel_name || 'deleted-channel'}
    }).map(chan => {
        return (
            <div key={chan.id} className="channel">
                {chan.name} {!window.Panel.Server.readonly &&
            <FontAwesomeIcon icon={"times"} className="x-icon" onClick={() => removeChannel(chan.id)}/>}
            </div>
        )
    });

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <label><b>Add Channel</b></label>
                    <DashboardSelect className="form-control" value={''} onChange={e => addChannel(e.target.value)}>
                        <option value={''} disabled={true}>Select a channel</option>
                        {availableChannels}
                    </DashboardSelect>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="channel-whitelist">
                        {activeChannels}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

const ChannelWhitelist: React.FC = () => {

    let [mode, setMode] = useGuildSetting(window.Panel.Server.id, 'music_mode', WhitelistState.OFF, true);

    let colName = mode != WhitelistState.OFF ? 'col-lg-6 col-md-12' : 'col-12';

    return (
        <div className="row">
            <div className="col-12">
                <h2>Channel Whitelist/Blacklist</h2>
                <div className="form-row">
                    <div className={colName}>
                        <label><b>Mode</b></label>
                        <DashboardSelect className="form-control" value={mode}
                                         onChange={e => setMode(WhitelistState[e.target.value])}>
                            <option value={WhitelistState.OFF}>Off</option>
                            <option value={WhitelistState.BLACKLIST}>Blacklist</option>
                            <option value={WhitelistState.WHITELIST}>Whitelist</option>
                        </DashboardSelect>
                    </div>
                    {mode != WhitelistState.OFF &&
                    <div className="col-lg-6 col-md-12">
                        <ChannelWhitelistChannels/>
                    </div>}
                </div>
            </div>
        </div>
    )
};
export default ChannelWhitelist;