import React, {Component} from 'react';
import LoggingSettings from './general/LogSettings';
import Field from "../Field";
import BotNick from "./general/BotNick";

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
                </div>
            </div>
        )
    }
}