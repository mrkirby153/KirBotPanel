import React, {Component} from 'react';
import LoggingSettings from './general/LogSettings';
import Field from "../Field";
import BotNick from "./general/BotNick";
import MutedRole from "./general/MutedRole";
import UserPersistence from "./general/UserPersistence";

export default class General extends Component {

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
            </div>
        )
    }
}