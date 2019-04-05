import React, {Component} from 'react';
import CommandPrefix from "./commands/CommandPrefix";

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
            </div>
        )
    }
}