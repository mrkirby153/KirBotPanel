import React, {Component} from 'react';
import PanelPermissions from "./PanelPermissions";
import RolePermissions from "./RolePermissions";
import {Tab} from "../tabs";
import reducer from "./reducer";
import rootSaga from "./saga";

class Permissions extends Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <PanelPermissions/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <RolePermissions/>
                    </div>
                </div>
            </div>
        )
    }
}

const tab: Tab = {
    key: 'permissions',
    name: 'Permissions',
    route: {
        path: '/permissions',
        component: Permissions
    },
    icon: 'user-shield',
    reducer: reducer,
    saga: rootSaga
};
export default tab;