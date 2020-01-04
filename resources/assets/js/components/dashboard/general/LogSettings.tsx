import React, {ChangeEvent, Component, ReactElement, useState} from 'react';
import Modal from "../../Modal";
import SettingsRepository from '../../../settings_repository'
import ld_find from 'lodash/find';
import ld_indexof from 'lodash/indexOf';
import ld_debounce from 'lodash/debounce';
import {DashboardInput, DashboardSelect} from "../../DashboardInput";
import {Events, LogMassSelectType, LogMode, LogSetting} from "./types";
import {connect, useDispatch, useSelector} from 'react-redux';
import {bindActionCreators} from "redux";
import {
    createLogSetting,
    deleteLogSetting,
    getLogSettings,
    logMassSelect,
    onLogCheckChange,
    saveLogSettings
} from "./actions";
import ConfirmButton from "../../ConfirmButton";

interface LogSettingsProps {
    log_events: Events,
    logSettings: LogSetting[]
    getLogSettings: typeof getLogSettings
    createLogSetting: typeof createLogSetting
}

interface LoggingSettingsState {
    log_timezone: string
}

interface LogChannelProps {
    id: string
}

const LogChannel: React.FC<LogChannelProps> = (props) => {
    const [editing, isEditing] = useState(false);
    const [mode, setMode] = useState<LogMode>(LogMode.Include);

    const dispatch = useDispatch();

    const settings: LogSetting = useSelector(state => {
        return ld_find(state.general.logSettings, l => {
            return l.id == props.id;
        })
    });

    const logEvents: Events = useSelector(state => state.general.logActions);

    if(!settings) {
        return null;
    }

    const explodeEvents = (num: number, noMsg: string): {
        friendly: string,
        raw: Array<string>
    } => {
        let arr: string[] = [];
        for (const key in logEvents) {
            if (logEvents.hasOwnProperty(key)) {
                if ((num & logEvents[key]) != 0) {
                    arr.push(key);
                }
            }
        }
        return {friendly: arr.length == 0 ? noMsg : arr.join(", "), raw: arr};
    };

    const onClose = () => {
        isEditing(false);
        dispatch(saveLogSettings(props.id))
    };

    const onCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const action = event.target.dataset.action;
        if(action) {
            dispatch(onLogCheckChange({
                id: props.id,
                mode: mode,
                number: parseInt(action),
                enabled: event.target.checked
            }))
        }
    };

    const dispatchMassSelect = (type: LogMassSelectType) => dispatch(logMassSelect({id: props.id, mode, type}));


    const {friendly: includedFriendly, raw: includedRaw} = explodeEvents(settings.included, 'All Events');
    const {friendly: excludedFriendly, raw: excludedRaw} = explodeEvents(settings.excluded, 'No Events');
    // Render checkboxes
    let checkboxes: ReactElement[] = [];
    for (const key in logEvents) {
        if (logEvents.hasOwnProperty(key)) {
            let checked = ld_indexof(mode == LogMode.Include ? includedRaw : excludedRaw, key) != -1;
            const checkboxId = `option_${props.id}_${key}`;
            checkboxes.push(
                <div className="custom-control custom-checkbox" key={key}>
                    <input type="checkbox" className="custom-control-input" id={checkboxId} checked={checked} onChange={onCheck} data-action={logEvents[key]}/>
                    <label className="custom-control-label" htmlFor={checkboxId}>{key}</label>
                </div>
            )
        }
    }

    return (
        <React.Fragment>
            <div className="log-channel">
                <span className="channel-name">{settings.channel.channel_name}</span>
                <div className="included">
                    <code>{includedFriendly}</code>
                </div>
                <div className="excluded">
                    <code>{excludedFriendly}</code>
                </div>
                <div className="btn-group mt-2">
                    <button className="btn btn-info" onClick={() => isEditing(true)}
                            disabled={window.Panel.Server.readonly}>
                        <i className="fas fa-edit"/> Edit
                    </button>
                    <ConfirmButton className="btn btn-danger"
                                   onConfirm={() => dispatch(deleteLogSetting(props.id))}
                                   confirmText={<React.Fragment><i className="fas fa-times"/> Confirm?</React.Fragment>}>
                        <i className="fas fa-times"/> Delete
                    </ConfirmButton>
                </div>
            </div>
            <Modal title={`Edit #${settings.channel.channel_name}`} open={editing} onClose={onClose}>
                <div className="btn-group">
                    <button className={"btn btn-primary " + (mode == LogMode.Include ? 'active' : '')} onClick={() => setMode(LogMode.Include)}>Include</button>
                    <button className={"btn btn-primary " + (mode == LogMode.Exclude ? 'active' : '')} onClick={() => setMode(LogMode.Exclude)}>Exclude</button>
                </div>
                <p className="mt-1">
                    Below are log events that can be {mode}d from the log channel. Leave blank to {mode == LogMode.Include? 'include all events' : 'exclude no events'}
                </p>
                <div className="btn-group btn-group-sm">
                    <button className="btn btn-secondary" onClick={() => dispatchMassSelect(LogMassSelectType.All)}>Select All</button>
                    <button className="btn btn-secondary" onClick={() => dispatchMassSelect(LogMassSelectType.None)}>Select None</button>
                    <button className="btn btn-secondary" onClick={() => dispatchMassSelect(LogMassSelectType.Invert)}>Invert Selection</button>
                </div>
                {checkboxes}
            </Modal>
        </React.Fragment>
    )
};

class LoggingSettings extends Component<LogSettingsProps, LoggingSettingsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            log_timezone: 'UTC'
        };
        this.onChange = this.onChange.bind(this);
        this.saveSettings = ld_debounce(this.saveSettings, 300);
    }

    onChange(event) {
        const {name, value, type, checked} = event.target;
        // @ts-ignore
        type === "checkbox" ? this.setState({[name]: checked}) : this.setState({[name]: value});
        type === "checkbox" ? this.saveSettings(name, checked) : this.saveSettings(name, value);
    }

    saveSettings(key, value) {
        SettingsRepository.setSetting(key, value, true);
    }

    componentDidMount(): void {
        this.props.getLogSettings();
    }


    render() {
        let textChannelElements: ReactElement[] = [];
        let existingIds = this.props.logSettings.map(s => s.channel_id);
        window.Panel.Server.channels.filter(chan => chan.type == 'TEXT').filter(chan => ld_indexof(existingIds, chan.id) == -1).forEach(channel => {
            textChannelElements.push(<option key={channel.id} value={channel.id}>#{channel.channel_name}</option>);
        });

        let logChannels = this.props.logSettings.map(fn => (
            <LogChannel id={fn.id} key={fn.id}/>
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
                                <DashboardSelect className="form-control" name="channelAdd" id="channelAdd" value={""}
                                                 onChange={e => this.props.createLogSetting(e.target.value)}>
                                    <option value={""} disabled>Add a channel...</option>
                                    {textChannelElements}
                                </DashboardSelect>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="log_timezone"><b>Log Timezone</b></label>
                                <DashboardInput type="text" className="form-control" name="log_timezone"
                                                id="log_timezone" value={this.state.log_timezone}
                                                onChange={this.onChange}/>
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

const actionCreators = dispatch => {
    return bindActionCreators({
        getLogSettings,
        createLogSetting
    }, dispatch);
};

const mapStateToProps = state => {
    return {
        log_events: state.general.logActions,
        logSettings: state.general.logSettings
    }
};
export default connect(mapStateToProps, actionCreators)(LoggingSettings)