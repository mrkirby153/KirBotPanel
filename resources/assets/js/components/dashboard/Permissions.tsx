import React, {Component} from 'react';
import PanelPermissions from "./permissions/PanelPermissions";
import RolePermissions from "./permissions/RolePermissions";

export default class Permissions extends Component {

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