import React, {Component} from 'react';
import LoggingSettings from './general/LogSettings';
import BotNick from "./general/BotNick";
import MutedRole from "./general/MutedRole";
import UserPersistence from "./general/UserPersistence";
import ChannelWhitelist from "./general/ChannelWhitelist";
import Starboard from './general/Starboard';
import {Tab} from "./tabs";
import reducer from './general/reducer';
import {bindActionCreators} from "redux";
import {getLogs, getLogsOk} from "./general/actionCreators";
import {connect} from 'react-redux';

class General extends Component<{
    getLogsOk: typeof getLogsOk
}> {

    componentDidMount(): void {
        this.props.getLogsOk(['a', 'b', 'c']);
    }

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

const actionCreators = dispatch => {
    return bindActionCreators({
        getLogs,
        getLogsOk
    }, dispatch);
};

const mapStateToProps = state => {
    return {
        general: state.general
    }
};

const withConnect = connect(mapStateToProps, actionCreators)(General);

const tab: Tab = {
    key: 'general',
    name: 'General',
    icon: 'cog',
    route: {
        path: '/',
        exact: true,
        component: withConnect
    },
    reducer: reducer
};

export default tab;