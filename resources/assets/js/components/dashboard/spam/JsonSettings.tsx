import React, {Component} from 'react';

import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';
import SettingsRepository from "../../../settings_repository";
import toastr from 'toastr';
import Ajv from 'ajv';

interface JsonSettingsState {
    confirm_discard: boolean,
    value: string,
    default: string,
}

interface JsonSettingsProps {
    schema: any,
    settingsKey: string
}

export default class JsonSettings extends Component<JsonSettingsProps, JsonSettingsState> {

    private readonly validate: any;
    private ajv: any;

    constructor(props) {
        super(props);
        let settings = JSON.stringify(SettingsRepository.getSetting(this.props.settingsKey, {}), null, 2);

        this.state = {
            confirm_discard: false,
            value: settings,
            default: settings
        };

        this.bodyChange = this.bodyChange.bind(this);
        this.discardChanges = this.discardChanges.bind(this);
        this.hasChanged = this.hasChanged.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.getErrors = this.getErrors.bind(this);

        this.ajv = new Ajv({allErrors: true});
        this.validate = new Ajv({allErrors: true}).compile(this.props.schema);
    }

    bodyChange(e) {
        this.setState({
            value: e,
            confirm_discard: false
        });
    }

    getErrors(): null | any[] {
        try {
            let value = JSON.parse(this.state.value);
            let valid = this.validate(value);
            if (!valid) {
                let errors = this.validate.errors;
                return this.ajv.errorsText(errors)
            }
        } catch (SyntaxError) {
            // Ignore
        }
        return null
    }

    hasChanged() {
        return this.state.value !== this.state.default
    }

    discardChanges() {
        if (this.state.confirm_discard) {
            let old = this.state.default;
            this.setState({
                value: old
            })
        } else {
            this.setState({
                confirm_discard: true
            })
        }
    }

    saveChanges() {
        let val = this.state.value;
        let to_save = JSON.parse(val);
        SettingsRepository.setSetting(this.props.settingsKey, to_save, true).then(() => {
            this.setState({
                value: val,
                default: val
            });
            toastr.success('Changes saved!')
        });
    }

    render() {
        let errors = this.getErrors();
        return (
            <div>
                {errors && <div className="alert alert-danger">
                    <b>Your configuration contains errors</b><br/>
                    {errors}
                </div>}
                {this.hasChanged() && <div className="btn-group mb-3">
                    <button className="btn btn-warning"
                            onClick={this.discardChanges}>{this.state.confirm_discard ? 'Confirm?' : 'Discard changes'}
                    </button>
                    < button className="btn btn-success" onClick={this.saveChanges} disabled={errors != null}>Save
                        Changes
                    </button>
                </div>}
                <AceEditor mode="json" theme="github" name="spam-settings" width="100%" showPrintMargin={false}
                           onChange={this.bodyChange} value={this.state.value}/>
            </div>
        );
    }
}