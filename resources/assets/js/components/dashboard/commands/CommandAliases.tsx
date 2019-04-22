import React, {Component, ReactElement} from 'react';
import axios from 'axios';
import _ from 'lodash';
import Field from "../../Field";


interface CommandAliasState {
    aliases: CommandAlias[],
    confirming: string[],
    creating: boolean,
}

interface AddingComponentState {
    command: string,
    alias: string,
    clearance: number
}

interface AddingComponentProps {
    onSubmit: Function,
    onCancel: Function
}

class AddingComponent extends Component<AddingComponentProps, AddingComponentState> {

    constructor(props) {
        super(props);
        this.state = {
            command: '',
            alias: '',
            clearance: 0
        };

        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    save(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    cancel() {
        this.props.onCancel()
    }

    onChange(e) {
        let {name, value} = e.target;

        // @ts-ignore
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <tr>
                <th colSpan={4}>
                    <form onSubmit={this.save}>
                        <div className="form-row">
                            <div className="col-md-3">
                                <Field>
                                    <label htmlFor="command">Command</label>
                                    <input type="text" name="command" className="form-control" required={true}
                                           value={this.state.command} onChange={this.onChange}/>
                                </Field>
                            </div>
                            <div className="col-md-3">
                                <Field>
                                    <label htmlFor="alias">Alias</label>
                                    <input type="text" name="alias" className="form-control" value={this.state.alias}
                                           onChange={this.onChange}/>
                                </Field>
                            </div>
                            <div className="col-md-3">
                                <Field>
                                    <label htmlFor="clearance">Clearance</label>
                                    <input type="number" name="clearance" className="form-control" min={-1}
                                           required={true} value={this.state.clearance} onChange={this.onChange}/>
                                </Field>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success">Create</button>
                                <button type="button" className="btn btn-warning" onClick={this.cancel}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </th>
            </tr>
        );
    }

}

export default class CommandAliases extends Component<{}, CommandAliasState> {
    constructor(props) {
        super(props);

        this.state = {
            aliases: [],
            confirming: [],
            creating: false,
        };

        this.getCommandAliases = this.getCommandAliases.bind(this);
        this.delete = this.delete.bind(this);
        this.isConfirming = this.isConfirming.bind(this);
        this.createCommand = this.createCommand.bind(this);
    }

    componentDidMount(): void {
        this.getCommandAliases()
    }

    getCommandAliases() {
        axios.get('/api/guild/' + window.Panel.Server.id + '/commands/aliases').then(resp => {
            this.setState({
                aliases: resp.data
            })
        })
    }

    delete(id) {
        if (this.isConfirming(id)) {
            axios.delete('/api/guild/' + window.Panel.Server.id + '/commands/aliases/' + id).then(resp => {
                let cmds = [...this.state.aliases].filter(cmd => cmd.id != id);
                let confirming = this.state.confirming.filter(i => i != id);
                this.setState({
                    aliases: cmds,
                    confirming: confirming
                })
            })
        } else {
            let a = [...this.state.confirming];
            a.push(id);
            this.setState({
                confirming: a
            })
        }
    }

    createCommand(command, alias, clearance) {
        axios.put('/api/guild/' + window.Panel.Server.id + '/commands/aliases', {
            command: command,
            alias: alias,
            clearance: clearance
        }).then(resp => {
            let cmds = [...this.state.aliases];
            cmds.push(resp.data);
            this.setState({
                aliases: cmds,
                creating: false
            })
        })
    }

    isConfirming(id: string): boolean {
        return _.indexOf(this.state.confirming, id) != -1;
    }

    render() {
        let aliases: ReactElement[] = [];
        this.state.aliases.forEach(alias => {
            aliases.push(
                <tr key={alias.id}>
                    <td>{alias.command}</td>
                    <td>{alias.alias ? alias.alias : <i>None</i>}</td>
                    <td>{alias.clearance != -1 ? alias.clearance : <i>Inherit</i>}</td>
                    <td>
                        <div className="btn-group">
                            <button className="btn btn-danger" onClick={() => this.delete(alias.id)} disabled={window.Panel.Server.readonly}>
                                <i className="fas fa-times"/> {this.isConfirming(alias.id) ? 'Confirm?' : 'Delete'}
                            </button>
                        </div>
                    </td>
                </tr>
            )
        });
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h2>Command Aliases</h2>
                        <p>A list of all configured command aliases</p>

                        <div className="table-responsive">
                            <table className="table table-hover mt-2">
                                <thead className="thead-light">
                                <tr>
                                    <th>Command</th>
                                    <th>Alias</th>
                                    <th>Clearance Override</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {aliases}
                                </tbody>
                                <tfoot>
                                {this.state.creating ? <AddingComponent onSubmit={e => {
                                        this.createCommand(e.command, e.alias, e.clearance);
                                    }} onCancel={() => {
                                        this.setState({
                                            creating: false
                                        })
                                    }}/> :
                                    !window.Panel.Server.readonly &&
                                    <tr>
                                        <th colSpan={4}>
                                            <button className="btn btn-success" onClick={() => {
                                                this.setState({
                                                    creating: true
                                                })
                                            }
                                            }><i className="fas fa-plus"/> Add
                                            </button>
                                        </th>
                                    </tr>}
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}