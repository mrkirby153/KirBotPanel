import React, {Component} from 'react';

interface FormProps {
    busy: boolean
}

export default class Form extends Component<FormProps, {}> {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <form className={this.props.busy ? 'busy' : ''}>
                    {this.props.children}
                </form>
            </div>
        );
    }
}