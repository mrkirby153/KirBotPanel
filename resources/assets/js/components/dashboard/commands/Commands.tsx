import React, {Component} from 'react';
import CommandPrefix from "./CommandPrefix";
import CustomCommands from "./CustomCommands";
import CommandAliases from "./CommandAliases";
import {Tab} from "../tabs";
import reducer from "./reducer";
import rootSaga from "./saga";

class Commands extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <CommandPrefix/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <CustomCommands/>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-12">
                        <CommandAliases/>
                    </div>
                </div>
            </div>
        )
    }
}

const tab: Tab = {
    key: 'commands',
    name: 'Commands',
    icon: 'sticky-note',
    route: {
        path: '/commands',
        component: Commands
    },
    reducer: reducer,
    saga: rootSaga
};
export default tab