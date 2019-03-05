import React, {Component, ReactElement} from 'react'
import Form from "../../Form";
import Field from "../../Field";
import SettingsRepository from "../../../settings_repository";
import axios from 'axios';

interface MutedState {
    success: boolean
    changed: boolean
    selected: string
}

export default class MutedRole extends Component<{}, MutedState> {

    constructor(props) {
        super(props);
        this.state = {
            success: false,
            changed: false,
            selected: SettingsRepository.getSetting('muted_role', '')
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.setState({
            changed: true,
            selected: event.target.value
        });
        axios.post('/api/guild/'+window.Panel.Server.id+'/muted-role', {
            role: event.target.value
        });
    }

    render() {
        let roles: ReactElement[] = [];
        window.Panel.Server.roles.forEach(role => {
            roles.push(<option value={role.id}>{role.name}</option>)
        });
        return (
            <div>
                <h2>Muted Role</h2>
                <p>
                    Select the role that will be applied to the user if they are muted
                </p>
                <Form busy={false}>
                    <Field success={this.state.success? "Muted role updated!" : null}
                           errors={this.state.selected == "" && this.state.changed ? "No muted role has been selected. Mutes will not work" : null}>
                        <select className="form-control" onChange={this.onChange} value={this.state.selected}>
                            <option value={""}>None</option>
                            {roles}
                        </select>
                    </Field>
                </Form>
            </div>
        );
    }

}