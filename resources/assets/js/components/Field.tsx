import React, {Component} from 'react';

interface FieldProps {
    help?: string,
    errors?: string|null,
    success?: string|null
}
export default class Field extends Component<FieldProps, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        let formClass = "form-group";
        if(this.props.errors) {
            formClass += " is-invalid";
        }
        if(this.props.success) {
            formClass += " is-valid";
        }
        return (
            <div>
                <div className={formClass}>
                    {this.props.children}
                    {this.props.help && <small className="form-text text-muted">{this.props.help}</small>}
                    {this.props.errors && <div className="invalid-feedback">{this.props.errors}</div> }
                    {this.props.success && <div className="valid-feedback">{this.props.success}</div>}
                </div>
            </div>
        );
    }

}