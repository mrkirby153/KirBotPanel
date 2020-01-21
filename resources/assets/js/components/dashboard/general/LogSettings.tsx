import React, {ChangeEvent, ReactElement, useCallback, useEffect, useState} from 'react';
import Modal from "../../Modal";
import ld_find from 'lodash/find';
import ld_indexof from 'lodash/indexOf';
import ld_debounce from 'lodash/debounce';
import {DashboardInput, DashboardSelect} from "../../DashboardInput";
import {Events, LogMassSelectType, LogMode, LogSetting} from "./types";
import {useDispatch, useSelector} from 'react-redux';
import {
    createLogSetting,
    deleteLogSetting,
    getLogEvents,
    getLogSettings,
    logMassSelect,
    onLogCheckChange,
    saveLogSettings
} from "./actions";
import ConfirmButton from "../../ConfirmButton";
import {useGuildSetting} from "../utils/hooks";
import {useTypedSelector} from "../reducers";

interface LogChannelProps {
    id: string
}

const LogChannel: React.FC<LogChannelProps> = (props) => {
    const [editing, isEditing] = useState(false);
    const [mode, setMode] = useState<LogMode>(LogMode.Include);

    const dispatch = useDispatch();

    const settings: LogSetting | undefined = useTypedSelector(state => {
        return ld_find(state.general.logSettings, l => {
            return l.id == props.id;
        })
    });

    const logEvents: Events = useTypedSelector(state => state.general.logActions);

    if (!settings) {
        return null;
    }

    const save = () => {
        dispatch(saveLogSettings(props.id));
    };

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
        save()
    };

    const debouncedSave = useCallback(ld_debounce(() => {
        save()
    }, 2000), []);

    const onCheck = (event: ChangeEvent<HTMLInputElement>) => {
        const action = event.target.dataset.action;
        if (action) {
            dispatch(onLogCheckChange({
                id: props.id,
                mode: mode,
                number: parseInt(action),
                enabled: event.target.checked
            }));
            debouncedSave();
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
                    <input type="checkbox" className="custom-control-input" id={checkboxId} checked={checked}
                           onChange={onCheck} data-action={logEvents[key]}/>
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
                                   confirmText={<React.Fragment><i
                                       className="fas fa-times"/> Confirm?</React.Fragment>}>
                        <i className="fas fa-times"/> Delete
                    </ConfirmButton>
                </div>
            </div>
            <Modal title={`Edit #${settings.channel.channel_name}`} open={editing} onClose={onClose}>
                <div className="btn-group">
                    <button className={"btn btn-primary " + (mode == LogMode.Include ? 'active' : '')}
                            onClick={() => setMode(LogMode.Include)}>Include
                    </button>
                    <button className={"btn btn-primary " + (mode == LogMode.Exclude ? 'active' : '')}
                            onClick={() => setMode(LogMode.Exclude)}>Exclude
                    </button>
                </div>
                <p className="mt-1">
                    Below are log events that can be {mode}d from the log channel. Leave blank
                    to {mode == LogMode.Include ? 'include all events' : 'exclude no events'}
                </p>
                <div className="btn-group btn-group-sm">
                    <button className="btn btn-secondary"
                            onClick={() => dispatchMassSelect(LogMassSelectType.All)}>Select All
                    </button>
                    <button className="btn btn-secondary"
                            onClick={() => dispatchMassSelect(LogMassSelectType.None)}>Select None
                    </button>
                    <button className="btn btn-secondary"
                            onClick={() => dispatchMassSelect(LogMassSelectType.Invert)}>Invert Selection
                    </button>
                </div>
                {checkboxes}
            </Modal>
        </React.Fragment>
    )
};

const LoggingSettings: React.FC = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getLogSettings());
        dispatch(getLogEvents());
    }, []);

    const settings: LogSetting[] = useTypedSelector(state => state.general.logSettings);

    const existingIds = settings.map(s => s.channel_id);
    let textChannelElements: ReactElement[] = window.Panel.Server.channels.filter(chan => chan.type == 'TEXT')
        .filter(chan => ld_indexof(existingIds, chan.id) == -1)
        .map(channel => <option key={channel.id} value={channel.id}>#{channel.channel_name}</option>);

    let logChannels = settings.map(setting => (<LogChannel id={setting.id} key={setting.id}/>));

    let [logTimezone, setLogTimezone] = useGuildSetting(window.Panel.Server.id, 'log_timezone', 'UTC', true);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Logging</h2>
                <p>
                    <b>Include: </b>A list of all events that are included in the log. <i>Leave blank to include all
                    events</i><br/>
                    <b>Exclude: </b>A list of all events that are excluded from the log. <i>Leave blank to exclude
                    nothing</i>
                </p>
                <div className="form-row">
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="channelAdd"><b>Add a channel</b></label>
                            <DashboardSelect className="form-control" name="channelAdd" id="channelAdd" value={""}
                                             onChange={e => dispatch(createLogSetting(e.target.value))}>
                                <option value={""} disabled>Add a channel...</option>
                                {textChannelElements}
                            </DashboardSelect>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <label htmlFor="log_timezone"><b>Log Timezone</b></label>
                            <DashboardInput type="text" className="form-control" name="log_timezone" id="log_timezone"
                                            value={logTimezone} onChange={e => setLogTimezone(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className="log-channels">
                    {logChannels}
                </div>
            </div>
        </div>
    )
};
export default LoggingSettings;