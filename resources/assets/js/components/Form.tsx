import React, {Component} from 'react';

interface FormProps {
    busy: boolean
    onSubmit?: Function
}

export default class Form extends Component<FormProps, {}> {

    private formRef: React.RefObject<HTMLFormElement>;

    constructor(props) {
        super(props);

        this.formRef = React.createRef();
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    handleOnSubmit(e) {
        e.preventDefault();
        if (this.props.onSubmit) {
            this.props.onSubmit(e);
        }
    }

    getForm(): HTMLFormElement {
        let val = this.formRef.current;
        if (val == null) {
            throw new Error("Form ref is null");
        }
        return val;
    }

    render() {
        return (
            <div>
                <form className={this.props.busy ? 'busy' : ''} onSubmit={this.handleOnSubmit} ref={this.formRef}>
                    {this.props.children}
                </form>
            </div>
        );
    }
}