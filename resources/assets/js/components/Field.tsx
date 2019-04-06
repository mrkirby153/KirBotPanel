import React, {Component} from 'react';

interface FieldProps {
    help?: string,
    errors?: string|null|any[],
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
        let errors = this.props.errors;
        if(Array.isArray(errors)) {
            errors = errors.join(', ')
        }
        return (
            <div>
                <div className={formClass}>
                    {this.props.children}
                    {this.props.help && <small className="form-text text-muted">{this.props.help}</small>}
                    {this.props.errors && <div className="invalid-feedback">{errors}</div> }
                    {this.props.success && <div className="valid-feedback">{this.props.success}</div>}
                </div>
            </div>
        );
    }

}