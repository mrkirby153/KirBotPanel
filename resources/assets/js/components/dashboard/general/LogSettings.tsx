import React, {ChangeEvent, Component, ReactElement} from 'react';
import axios from 'axios';
import {Channel} from '../../../types/ApiTypes';
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
    }[]
}

interface LogChannelProps {
    channel: any,
    included: number,
    excluded: number,
    logEvents: any[],
    onDelete?: Function
    onCheck?: Function
    onSave?: Function
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
                            className={"btn btn-primary" + (mode === 'include' ? ' active' : '')}>Include
                        </button>
                        <button
                            className={'btn btn-primary' + (mode === 'exclude' ? ' active' : '')}>Exclude
                        </button>
                    </div>
                    <p className="mt-1">
                        Below are log events that can be included/excluded from the log channel. Leave blank to include
                        all elements
                    </p>
                    <div className="btn-group btn-group-sm">
                        <button className="btn btn-secondary">Select All</button>
                        <button className="btn btn-secondary">Select None</button>
                        <button className="btn btn-secondary">Invert Selection</button>
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
            log_settings: []
        };
        this.updateLogSettings = this.updateLogSettings.bind(this);
        this.saveLogSettings = this.saveLogSettings.bind(this);
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
        axios.get('/api/guild/' + window.Server.id + '/log-settings').then(resp => {
            this.setState({
                log_settings: resp.data
            });
        })
    }

    updateLogSettings(id: string, data: any) {
        this.setState((oldState, props) => {
            let index = _.findIndex(oldState.log_settings, f => f.id == id);

            let clone = Object.assign({}, oldState);
            let mode = (data.mode == 'include') ? 'included' : 'excluded';
            if (data.checked) {
                // @ts-ignore
                clone.log_settings[index][mode] |= data.number;
            } else {
                // @ts-ignore
                clone.log_settings[index][mode] &= ~data.number;
            }
            return clone;
        });
    }

    saveLogSettings(id: string) {
        let object = _.find(this.state.log_settings, f => f.id == id);
        console.log("saving");
        console.log(object);
    }

    render() {
        let textChannelElements: ReactElement[] = [];
        window.Server.channels.filter(chan => chan.type == 'TEXT').forEach(channel => {
            textChannelElements.push(<option key={channel.id} value={channel.id}>#{channel.channel_name}</option>);
        });

        let logChannels = this.state.log_settings.map(fn => (
            <LogChannel channel={fn.channel} excluded={fn.excluded} included={fn.included}
                        logEvents={this.state.log_events} key={fn.id}
                        onCheck={(e: any) => this.updateLogSettings(fn.id, e)}
                        onSave={() => this.saveLogSettings(fn.id)}/>));

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
                                <label htmlFor="logTimezone"><b>Log Timezone</b></label>
                                <input type="text" className="form-control" name="logTimezone" id="logTimezone"/>
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