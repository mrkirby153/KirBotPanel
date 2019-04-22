import React, {Component} from 'react';
import SettingsRepository from "../../../settings_repository";
import _ from 'lodash';
import {DashboardInput} from "../../DashboardInput";


interface SkipSettingsState {
    music_skip_cooldown: number,
    music_skip_timer: number
}

export default class SkipSettings extends Component<{}, SkipSettingsState> {
    constructor(props) {
        super(props);

        this.state = {
            music_skip_cooldown: SettingsRepository.getSetting('music_skip_cooldown', 0),
            music_skip_timer: SettingsRepository.getSetting('music_skip_timer', 30)
        };

        this.change = this.change.bind(this);
        this.save = _.debounce(this.save.bind(this), 250);
    }


    change(e) {
        let {name, value} = e.target;

        // @ts-ignore
        this.setState({
            [name]: value
        });
        this.save(name, value);
    }

    save(key, val) {
        SettingsRepository.setSetting(key, val, true)
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <h2>Skip Settings</h2>
                        Configure settings for vote skipping
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="form-group">
                            <label><b>Skip Cooldown</b></label>
                            <DashboardInput type="number" min={0} className="form-control" value={this.state.music_skip_cooldown}
                                   onChange={this.change} name="music_skip_cooldown"/>
                            <small className="form-text text-muted">
                                The time in seconds a user has to wait between starting a skip vote
                            </small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-group">
                            <label><b>Skip Timer</b></label>
                            <DashboardInput type="number" min={0} className="form-control" value={this.state.music_skip_timer}
                                   onChange={this.change} name="music_skip_timer"/>
                            <small className="form-text text-muted">
                                How long the bot waits for votes
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}