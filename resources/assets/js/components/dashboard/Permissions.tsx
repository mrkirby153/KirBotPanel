import React, {Component} from 'react';
import PanelPermissions from "./permissions/PanelPermissions";
import RolePermissions from "./permissions/RolePermissions";
import {Tab} from "./tabs";

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
    icon: 'user-shield'
};
export default tab;