import React, {Component} from 'react';
import LoggingSettings from './general/LogSettings';
import BotNick from "./general/BotNick";
import MutedRole from "./general/MutedRole";
import UserPersistence from "./general/UserPersistence";
import ChannelWhitelist from "./general/ChannelWhitelist";
import Starboard from './general/Starboard';
import {Tab} from "./tabs";

class General extends Component {

    render() {
        return (
            <div>
                <LoggingSettings/>
                <hr/>
                <div className="row">
                    <div className="col-lg-6 col-md-12">
                        <BotNick/>
                    </div>
                    <div className="col-lg-6 col-md-12">
                        <MutedRole/>
                    </div>
                </div>
                <hr/>
                <UserPersistence/>
                <hr/>
                <ChannelWhitelist/>
                <hr/>
                <Starboard/>
            </div>
        )
    }
}

const tab: Tab = {
    name: 'General',
    icon: 'cog',
    route: {
        path: '/',
        exact: true,
        component: General
    }
};

export default tab;