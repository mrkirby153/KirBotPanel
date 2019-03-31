import React, {Component} from 'react';
import PanelPermissions from "./permissions/PanelPermissions";

export default class Permissions extends Component {

    render() {
        return (
            <div className="col-12">
                <PanelPermissions/>
            </div>
        )
    }
}