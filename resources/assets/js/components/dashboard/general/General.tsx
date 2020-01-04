import React, {Component} from 'react';
import LoggingSettings from './LogSettings';
import BotNick from "./BotNick";
import MutedRole from "./MutedRole";
import UserPersistence from "./UserPersistence";
import ChannelWhitelist from "./ChannelWhitelist";
import Starboard from './Starboard';
import {Tab} from "../tabs";
import reducer from './reducer';
import {bindActionCreators} from "redux";
import {getLogEvents, getLogEventsOk} from "./actionCreators";
import {connect} from 'react-redux';
import saga from './saga';

interface PropsFromDispatch {
    getLogs: typeof getLogEvents
}

type AllProps = PropsFromDispatch

class General extends Component<AllProps> {

    componentDidMount(): void {
        this.props.getLogs();
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

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getLogs: getLogEvents
    }, dispatch);
};

const mapStateToProps = state => {
    return {
        general: state.general
    }
};

const withConnect = connect(mapStateToProps, mapDispatchToProps)(General);

const tab: Tab = {
    key: 'general',
    name: 'General',
    icon: 'cog',
    route: {
        path: '/',
        exact: true,
        component: withConnect
    },
    reducer: reducer,
    saga: saga
};

export default tab;