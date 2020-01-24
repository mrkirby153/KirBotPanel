import React from 'react';
import {Tab} from "../tabs";
import {DashboardSwitch} from "../../DashboardInput";
import {useGuildSetting} from "../utils/hooks";
import ChannelWhitelist from "./ChannelWhitelist";
import QueueSettings from "./QueueSettings";
import SkipSettings from "./SkipSettings";

const Music: React.FC = () => {

    const [enabled, setEnabled] = useGuildSetting(window.Panel.Server.id, 'music_enabled', 0, true);

    return (
        <React.Fragment>
            <h2>Master Switch</h2>
            <p>This switch allows KirBot to play music in voice channels on your server. If this is disabled, the bot
                will ignore music related commands and they will not show up in help</p>
            <DashboardSwitch label="Master Switch" id="music-master-switch" checked={enabled == 1}
                             onChange={e => setEnabled(e.target.checked ? 1 : 0)}/>
            {enabled == 1 && <React.Fragment>
                <hr/>
                <div className="row">
                    <div className="col-12">
                        <ChannelWhitelist/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <QueueSettings/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <SkipSettings/>
                    </div>
                </div>
            </React.Fragment>}
        </React.Fragment>
    )
};

const tab: Tab = {
    key: 'music',
    name: 'Music',
    icon: 'music',
    route: {
        path: '/music',
        component: Music
    }
};
export default tab;