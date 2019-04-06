import React, {Component, ReactElement} from 'react';
import axios from 'axios';
import Modal from "../../Modal";
import Field from "../../Field";
import Form from "../../Form";
import Switch from "../../Switch";


interface CustomCommandsState {
    commands: CustomCommand[],
    editing: boolean,
    editing_id: string|null,
    command_name: string,
    command_response: string,
    respect_whitelist: boolean,
    clearance: number,
    errors: any[],
    open_modal: boolean
}

export default class CustomCommands extends Component<{}, CustomCommandsState> {
    constructor(props) {
        super(props);
        this.state = {
            commands: [],
            editing: false,
            editing_id: null,
            command_name: '',
            command_response: '',
            respect_whitelist: false,
            clearance: -1,
            errors: [],
            open_modal: false
        };

        this.getCustomCommands = this.getCustomCommands.bind(this);
        this.onChange = this.onChange.bind(this);
        this.createButton = this.createButton.bind(this);
        this.cancelEditing = this.cancelEditing.bind(this);
    }

    componentDidMount(): void {
        this.getCustomCommands();
    }

    getCustomCommands() {
        axios.get('/api/guild/' + window.Panel.Server.id + '/commands').then(resp => {
            this.setState({
                commands: resp.data
            })
        })
    }

    onChange(e) {
        let {name, value, checked, type} = e.target;
        if (type == 'checkbox') {
            value = checked
        }
        // @ts-ignore
        this.setState({[name]: value});
    }

    createButton() {
        this.setState({
            editing: false,
            command_response: '',
            command_name: '',
            clearance: 0,
            respect_whitelist: false,
            errors: [],
            open_modal: true
        });
    }

    cancelEditing() {
        this.setState({
            editing: false,
            editing_id: '',
            open_modal: false
        })
    }

    render() {
        let commands: ReactElement[] = [];
        this.state.commands.forEach(command => {
            commands.push(
                <tr key={command.id}>
                    <td>{command.name}</td>
                    <td>{command.data}</td>
                    <td>{command.clearance_level}</td>
                    <td>
                        <div className="btn-group">
                            <button className="btn btn-info"><i className="fas fa-pen"/></button>
                        </div>
                    </td>
                </tr>
            )
        });
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h2>Custom Commands</h2>
                        <p>
                            The table below is all the commands registered on the server
                        </p>
                        <div className="table-responsive">
                            <table className="table mt-1 table-bordered table-hover">
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Response</th>
                                    <th scope="col">Clearance</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {commands}
                                </tbody>
                                <tfoot>
                                <tr>
                                    <td colSpan={4}>
                                        <button className="btn btn-success" onClick={this.createButton}><i className="fas fa-plus"/> New Command
                                        </button>
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                <Modal title={this.state.editing ? 'Edit Command' : 'Add Command'} open={this.state.open_modal}>
                    <Form busy={false}>
                        <Field help="The command's name" errors={this.state.errors['command_name']}>
                            <label>Command Name</label>
                            <input type="text" className="form-control" name="command_name"
                                   value={this.state.command_name} onChange={this.onChange}/>
                        </Field>
                        <Field help="Respect the command whitelist" errors={this.state.errors['respect_whitelist']}>
                            <Switch label="Respect Whitelist" id="respectWhitelist" name="respect_whitelist"
                                    checked={this.state.respect_whitelist} onChange={this.onChange}/>
                        </Field>
                        <Field help="What the command returns when executed" errors={this.state.errors['command_response']}>
                            <label>Command Response</label>
                            <textarea className="form-control" name="command_response"
                                      value={this.state.command_response} onChange={this.onChange}/>
                        </Field>
                        <Field errors={this.state.errors['clearance']}>
                            <label>Clearance</label>
                            <input type="number" min={0} className="form-control" name="clearance"
                                   value={this.state.clearance} onChange={this.onChange}/>
                        </Field>
                        <hr/>
                        {this.state.editing ?
                            <button type="button" className="btn btn-danger">Delete</button> : null}
                        <div className="btn-group float-right">
                            {this.state.editing ?
                                <button type="button" className="btn btn-secondary" onClick={this.cancelEditing}>Cancel</button> : null}
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}