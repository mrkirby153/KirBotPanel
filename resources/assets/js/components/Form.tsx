import React, {Component} from 'react';

interface FormProps {
    busy: boolean
    onSubmit?: Function
}

export default class Form extends Component<FormProps, {}> {
    constructor(props) {
        super(props);

        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnSubmit(e) {
        e.preventDefault();
        if(this.props.onSubmit) {
            this.props.onSubmit(e);
        }
    }

    render() {
        return (
            <div>
                <form className={this.props.busy ? 'busy' : ''} onSubmit={this.handleOnSubmit}>
                    {this.props.children}
                </form>
            </div>
        );
    }
}