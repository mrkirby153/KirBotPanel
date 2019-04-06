import React, {Component} from 'react';
import CommandPrefix from "./commands/CommandPrefix";
import CustomCommands from "./commands/CustomCommands";

export default class Commands extends Component {
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
            </div>
        )
    }
}