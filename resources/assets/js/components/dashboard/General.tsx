import React, {Component, ReactElement} from 'react';
import axios from 'axios';

interface LoggingSettingsState {
    log_events: any[],
}

class LoggingSettings extends Component<{}, LoggingSettingsState> {

    constructor(props: any) {
        super(props);
        this.state = {
            log_events: []
        }
    }


    componentDidMount(): void {
        this.retrieveLogSettings();
    }

    retrieveLogSettings() {
        axios.get('/api/log-events').then(resp => {
            this.setState({
                log_events: resp.data
            })
        })
    }

    render() {
        let textChannelElements: ReactElement[] = [];
        window.Server.channels.filter(chan => chan.type == 'TEXT').forEach(channel => {
            textChannelElements.push(<option key={channel.id} value={channel.id}>#{channel.channel_name}</option>);
        });

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
                </div>
            </div>
        );
    }

}

export default class General extends Component {

    render() {
        return (
            <div>
                <LoggingSettings/>
            </div>
        )
    }
}