import React, {Component} from 'react';
import axios from 'axios';
import toastr from 'toastr';

interface AdminSettingsState {
    server: string,
    servers: Guild[],
    key: string,
    value: string
}

interface Guild {
    id: string,
    name: string,
    owner: string,
    created_at: string,
    updated_at: string,
    settings: ServerSetting[],
    deleted_at: string
}

export default class AdminSettings extends Component<{}, AdminSettingsState> {
    constructor(props) {
        super(props);

        this.state = {
            server: '',
            servers: [],
            key: '',
            value: ''
        };

        this.changeServer = this.changeServer.bind(this);
        this.changeKey = this.changeKey.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
    }


    componentDidMount(): void {
        this.getServers();
    }

    private getServers() {
        axios.get('/api/admin/guilds').then(resp => {
            this.setState({
                servers: resp.data
            })
        })
    }

    changeServer(e) {
        let {value} = e.target;
        this.setState({
            server: value,
            key: ''
        })
    }

    changeKey(e) {
        let {value} = e.target;
        let setting = this.getSettings().find(s => s.key == value);
        this.setState({
            key: value,
            value: setting ? setting.value : ''
        })
    }

    changeValue(e) {
        let {value} = e.target;
        this.setState({
            value: value
        })
    }

    getSettings(): ServerSetting[] {
        let server = this.state.servers.find(p => p.id == this.state.server);
        if (server != undefined) {
            return server.settings;
        }
        return [];
    }

    save() {
        axios.patch('/api/admin/setting', {
            guild: this.state.server,
            key: this.state.key,
            value: this.state.value
        }).then(resp => {
            toastr.success('Setting saved');
            this.setState({
                servers: resp.data
            })
        })
    }

    delete() {
        axios.patch('/api/admin/setting', {
            guild: this.state.server,
            key: this.state.key,
            value: null
        }).then(resp => {
            toastr.success('Setting deleted!');
            this.setState({
                servers: resp.data,
                key: '',
                value: ''
            })
        })
    }

    render() {
        let guilds = this.state.servers.map(server => {
            return <option key={server.id} value={server.id}>{server.name} ({server.id})</option>
        });
        let properties = this.getSettings().map(prop => {
            return <option key={prop.id} value={prop.key}>{prop.key}</option>
        });
        return (
            <div className="card">
                <div className="card-header">
                    Admin
                </div>
                <div className="card-body">
                    <div className="form-row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="server-text"><b>Server ID</b></label>
                                <input type="text" id="server-text" className="form-control" value={this.state.server}
                                       onChange={this.changeServer}/>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="server-select"><b>Server</b></label>
                                <select id="server-select" className="form-control" value={this.state.server}
                                        onChange={this.changeServer}>
                                    <option value={''}>Select a server</option>
                                    {guilds}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="property"><b>Key</b></label>
                                <input type="text" className="form-control" placeholder="Key" value={this.state.key}
                                       onChange={this.changeKey} disabled={this.state.server == ''}/>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="property"><b>Setting</b></label>
                                <select id="property" className="form-control" value={this.state.key}
                                        onChange={this.changeKey} disabled={this.state.server == ''}>
                                    <option value={''}>Select a property</option>
                                    {properties}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-12">
                            <div className="form-group">
                                <label htmlFor="value"><b>Value</b></label>
                                <textarea className="form-control" onChange={this.changeValue} value={this.state.value}
                                          disabled={this.state.key == ''}/>
                            </div>
                        </div>
                    </div>

                    <div className="btn-group">
                        <input type="button" className="btn btn-success" value={'Save'} onClick={this.save}/>
                        <input type="button" className="btn btn-danger" value={'Delete'} onClick={this.delete}/>
                    </div>
                </div>
            </div>
        )
    }
}