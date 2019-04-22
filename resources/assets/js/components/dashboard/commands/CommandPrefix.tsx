import React, {Component} from 'react';
import Form from "../../Form";
import Field from "../../Field";
import SettingsRepository from "../../../settings_repository";

interface CommandPrefixState {
    prefix: string,
    prefix_errors: string | null,
    success: boolean,
    busy: boolean
}

export default class CommandPrefix extends Component<{}, CommandPrefixState> {

    private readonly submitRef: React.RefObject<Form>;
    private oldPrefix: string;

    constructor(props) {
        super(props);
        this.state = {
            prefix: SettingsRepository.getSetting('command_prefix', '!'),
            prefix_errors: null,
            success: false,
            busy: false
        };
        this.submitRef = React.createRef();
        this.oldPrefix = this.state.prefix;

        this.onChange = this.onChange.bind(this);
        this.save = this.save.bind(this);
    }

    onChange(e) {
        let {value} = e.target;
        this.setState({
            prefix: value,
            success: false,
            prefix_errors: null
        })
    }

    save() {
        if(this.oldPrefix == this.state.prefix) {
            return;
        }
        if (this.state.prefix == "") {
            this.setState({
                prefix_errors: 'Prefix is required'
            });
            return;
        }
        this.setState({
            busy: true
        });
        SettingsRepository.setSetting('command_prefix', this.state.prefix, true).then(() => {
            this.setState({
                busy: false,
                success: true
            });
            this.oldPrefix = this.state.prefix
        })
    }

    render() {
        let example_command = this.state.prefix + 'play https://www.youtube.com/watch/dQw4w9WgXcQ';
        return (
            <div>
                <div className="row">
                    <div className="col-lg-6 col-sm-12">
                        <Form busy={this.state.busy} ref={this.submitRef} onSubmit={this.save}>
                            <Field success={this.state.success ? 'Prefix saved!' : null}
                                   errors={this.state.prefix_errors}>
                                <label htmlFor="commandPrefix"><b>Command Prefix</b></label>
                                <input type="text" className="form-control" id="commandPrefix" onChange={this.onChange}
                                       value={this.state.prefix} onBlur={this.save} required={true}/>
                            </Field>
                        </Form>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                        <h5>Example Command</h5>
                        <code>{example_command}</code>
                    </div>
                </div>
            </div>
        );
    }
}