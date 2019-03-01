import React, {ChangeEvent, Component, ReactElement} from 'react';
import axios from 'axios';
import Modal from "../../Modal";
import _ from 'lodash';
import {string} from "prop-types";

interface LoggingSettingsState {
    log_events: any[],
    log_settings: {
        id: string,
        server_id: string,
        channel_id: string,
        included: number,
        excluded: number,
        created_at: string,
        updated_at: string,
        channel: Channel
    }[],
    log_timezone: string
}

interface LogChannelProps {
    channel: any,
    included: number,
    excluded: number,
    logEvents: any[],
    onDelete?: Function
    onCheck?: Function
    onSave?: Function
    selectAll?: Function,
    invertSelection?: Function,
    selectNone?: Function
}

interface LogChannelState {
    editing: boolean,
    deleting: boolean,

    settings: {
        mode: 'include' | 'exclude'
    }
}

interface LogEvents {
    [key: string]: number
}

class LogChannel extends Component<LogChannelProps, LogChannelState> {

    constructor(props: any) {
        super(props);
        this.state = {
            editing: false,
            deleting: false,
            settings: {
                mode: 'include',
            }
        };

        this.delete = this.delete.bind(this);
        this.edit = this.edit.bind(this);
        this.onCheck = this.onCheck.bind(this);
        this.onClose = this.onClose.bind(this);
        this.setMode = this.setMode.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.selectNone = this.selectNone.bind(this);
        this.invertSelection = this.invertSelection.bind(this);
    }


    getIncluded(): string {
        let events = this.explodeEvents(this.props.included);
        let str = Object.keys(events).filter(e => events.hasOwnProperty(e)).join(", ");
        return (str !== "") ? str : "All events";
    }

    getExcluded(): string {
        let events = this.explodeEvents(this.props.excluded);
        let str = Object.keys(events).filter(e => events.hasOwnProperty(e)).join(", ");
        return (str !== "") ? str : "No events";
    }

    private explodeEvents(num: number): LogEvents {
        let arr: LogEvents = {};
        for (const key in this.props.logEvents) {
            if (this.props.logEvents.hasOwnProperty(key)) {
                if ((num & this.props.logEvents[key]) !== 0) {
                    arr[key] = this.props.logEvents[key];
                }
            }
        }
        return arr;
    }

    delete() {
        if (this.state.deleting) {
            if (this.props.onDelete) {
                this.props.onDelete()
            }
        } else {
            this.setState({
                deleting: true
            })
        }
    }

    edit() {
        this.setState({
            editing: true,
        })
    }

    onCheck(event: any) {
        let target = event.target;
        let event_name = target.id.substring("option_".length);
        if (this.props.onCheck) {
            this.props.onCheck({
                mode: this.state.settings.mode,
                checked: target.checked,
                number: this.props.logEvents[event_name]
            });
        }
    }

    onClose() {
        this.setState({
            editing: false
        });
        if (this.props.onSave) {
            this.props.onSave()
        }
    }

    setMode(mode: 'include' | 'exclude') {
        this.setState({
            settings: {
                mode: mode
            }
        });
    }

    selectAll() {
        if (this.props.selectAll) {
            this.props.selectAll({
                mode: this.state.settings.mode
            })
        }
    }

    selectNone() {
        if (this.props.selectNone) {
            this.props.selectNone({
                mode: this.state.settings.mode
            })
        }
    }

    invertSelection() {
        if (this.props.invertSelection) {
            this.props.invertSelection({
                mode: this.state.settings.mode
            })
        }
    }

    render() {
        let elementCheckboxes: ReactElement[] = [];
        let mode = (this.state.settings.mode) ? this.state.settings.mode : 'include';

        let explodedIn = Object.keys(this.explodeEvents(this.props.included));
        let explodedEx = Object.keys(this.explodeEvents(this.props.excluded));

        for (const key in this.props.logEvents) {
            if (this.props.logEvents.hasOwnProperty(key)) {
                let checked = _.indexOf(this.state.settings.mode == 'include' ? explodedIn : explodedEx, key) != -1;
                elementCheckboxes.push(<div className="custom-control custom-checkbox" key={key}>
                    <input type="checkbox" className="custom-control-input" id={"option_" + key}
                           checked={checked} onChange={this.onCheck}/>
                    <label className="custom-control-label"
                           htmlFor={"option_" + key}>{key}</label>
                </div>);
            }
        }

        return (
            <div className="log-channel">
                <span className="channel-name">{this.props.channel.channel_name}</span>
                <div className="included">
                    <code>{this.getIncluded()}</code>
                </div>
                <div className="excluded">
                    <code>{this.getExcluded()}</code>
                </div>

                <div className="btn-group mt-2">
                    <button className="btn btn-info" onClick={this.edit}><i className="fas fa-edit"/> Edit</button>
                    <button className="btn btn-danger" onClick={this.delete}><i
                        className="fas fa-times"/> {this.state.deleting ? 'Confirm?' : 'Delete'}</button>
                </div>

                <Modal title={"Edit #" + this.props.channel.channel_name} open={this.state.editing}
                       onClose={this.onClose}>
                    <div className="btn-group">
                        <button
                            className={"btn btn-primary" + (mode === 'include' ? ' active' : '')}
                            onClick={(e => this.setMode('include'))}>Include
                        </button>
                        <button
                            className={'btn btn-primary' + (mode === 'exclude' ? ' active' : '')}
                            onClick={(e => this.setMode('exclude'))}>Exclude
                        </button>
                    </div>
                    <p className="mt-1">
                        Below are log events that can be included/excluded from the log channel. Leave blank to include
                        all elements
                    </p>
                    <div className="btn-group btn-group-sm">
                        <button className="btn btn-secondary" onClick={this.selectAll}>Select All</button>
                        <button className="btn btn-secondary" onClick={this.selectNone}>Select None</button>
                        <button className="btn btn-secondary" onClick={this.invertSelection}>Invert Selection</button>
                    </div>
                    {elementCheckboxes}
                </Modal>
            </div>
        )
    }
}

export default class LoggingSettings extends Component<{}, LoggingSettingsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            log_events: [],
            log_settings: [],
            log_timezone: 'UTC'
        };
        this.updateLogSettings = this.updateLogSettings.bind(this);
        this.saveLogSettings = this.saveLogSettings.bind(this);
        this.delete = this.delete.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        const {name, value, type, checked} = event.target;
        // @ts-ignore
        type === "checkbox" ? this.setState({[name]: checked}) : this.setState({[name]: value});
    }


    componentDidMount(): void {
        this.retrieveLogSettings();
    }

    retrieveLogSettings() {
        axios.get('/api/log-events').then(resp => {
            this.setState({
                log_events: resp.data
            })
        });
        axios.get('/api/guild/' + window.Panel.Server.id + '/log-settings').then(resp => {
            this.setState({
                log_settings: resp.data
            });
        });
        axios.get('/api/guild/' + window.Panel.Server.id + '/log-timezone').then(resp => {
            this.setState({
                log_timezone: resp.data
            });
        })
    }

    updateLogSettings(id: string, data: any) {
        this.setState((oldState, props) => {
            let index = _.findIndex(oldState.log_settings, f => f.id == id);

            let clone = Object.assign({}, oldState);
            let mode = (data.mode == 'include') ? 'included' : 'excluded';
            if (data.checked) {
                clone.log_settings[index][mode] |= data.number;
            } else {
                clone.log_settings[index][mode] &= ~data.number;
            }
            return clone;
        });
    }

    massSelect(id: string, type: 'exclude' | 'include', mode: 'all' | 'none' | 'invert') {
        this.setState((oldState, props) => {
            let index = _.findIndex(oldState.log_settings, f => f.id == id);

            let clone = Object.assign({}, oldState);
            let ty = (type == 'include') ? 'included' : 'excluded';

            let val = clone.log_settings[index][ty];
            switch (mode) {
                case 'all':
                    Object.keys(this.state.log_events).forEach(key => {
                        val |= this.state.log_events[key];
                    });
                    break;
                case 'none':
                    val = 0;
                    break;
                case 'invert':
                    val = ~val;
                    break;
            }
            clone.log_settings[index][ty] = val;
            return clone;
        });
    }

    saveLogSettings(id: string) {
        let object = _.find(this.state.log_settings, f => f.id == id);
        if (object != null) {
            axios.patch('/api/guild/' + window.Panel.Server.id + '/log-settings/' + id, {
                include: object.included,
                exclude: object.excluded
            })
        }
    }

    delete(id: string) {
        let arr = _.filter(this.state.log_settings, f => f.id != id);
        this.setState({
            log_settings: arr
        })
    }

    render() {
        let textChannelElements: ReactElement[] = [];
        let existingIds = this.state.log_settings.map(s => s.channel_id);
        window.Panel.Server.channels.filter(chan => chan.type == 'TEXT').filter(chan => _.indexOf(existingIds, chan.id) == -1).forEach(channel => {
            textChannelElements.push(<option key={channel.id} value={channel.id}>#{channel.channel_name}</option>);
        });

        let logChannels = this.state.log_settings.map(fn => (
            <LogChannel channel={fn.channel} excluded={fn.excluded} included={fn.included}
                        logEvents={this.state.log_events} key={fn.id}
                        onCheck={(e: any) => this.updateLogSettings(fn.id, e)}
                        onSave={() => this.saveLogSettings(fn.id)}
                        invertSelection={e => this.massSelect(fn.id, e.mode, 'invert')}
                        selectAll={e => this.massSelect(fn.id, e.mode, 'all')}
                        selectNone={e => this.massSelect(fn.id, e.mode, 'none')}
                        onDelete={e => this.delete(fn.id)}/>
        ));

        return (
            <div className="row">
                <div className="col-12">
                    <h2>Logging</h2>
                    <p>
                        <b>Include:</b> A list of all events that are included in the log. <i>Leave blank to include
                        all events</i><br/>
                        <b>Exclude:</b> A list of all events that are excluded from the log. <i>Leave blank to
                        exclude nothing</i>
                    </p>
                    <div className="form-row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="channelAdd"><b>Add a channel</b></label>
                                <select className="form-control" name="channelAdd" id="channelAdd" defaultValue={""}>
                                    <option value={""} disabled>Add a channel...</option>
                                    {textChannelElements}
                                </select>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="log_timezone"><b>Log Timezone</b></label>
                                <input type="text" className="form-control" name="log_timezone" id="log_timezone"
                                       value={this.state.log_timezone} onChange={this.onChange}/>
                            </div>
                        </div>
                    </div>
                    <div className="log-channels">
                        {logChannels}
                    </div>
                </div>
            </div>
        );
    }

}