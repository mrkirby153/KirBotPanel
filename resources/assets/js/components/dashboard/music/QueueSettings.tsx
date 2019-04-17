import React, {Component} from 'react';
import SettingsRepository from "../../../settings_repository";
import _ from 'lodash';

interface QueueSettingsState {
    music_max_queue_length: number,
    music_max_song_length: number,
    music_playlists: number
}

export default class QueueSettings extends Component<{}, QueueSettingsState> {
    constructor(props) {
        super(props);

        this.state = {
            music_max_queue_length: SettingsRepository.getSetting('music_max_queue_length', -1),
            music_max_song_length: SettingsRepository.getSetting('music_max_song_length', -1),
            music_playlists: SettingsRepository.getSetting('music_playlists', 1)
        };

        this.onChange = this.onChange.bind(this);
        this.save = _.debounce(this.save.bind(this), 250)
    }

    onChange(e) {
        let {name, value} = e.target;

        // @ts-ignore
        this.setState({
            [name]: value
        });
        this.save(name, value)
    }

    save(name, value) {
        SettingsRepository.setSetting(name, value, true)
    }

    render() {
        return (
            <div className="row">
                <div className="col-12">
                    <h2>Queue Settings</h2>
                    <div className="row">
                        <div className="col-lg-4 col-md-12">
                            <div className="form-group">
                                <label><b>Queue Length</b></label>
                                <input type="number" min={-1} className="form-control" name="music_max_queue_length"
                                       value={this.state.music_max_queue_length} onChange={this.onChange}/>
                                <small className="form-text text-muted">
                                    The max length in minutes the queue can be. -1 to disable
                                </small>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="form-group">
                                <label><b>Max Song Length</b></label>
                                <input type="number" min={-1} className="form-control" name="music_max_song_length"
                                       value={this.state.music_max_song_length} onChange={this.onChange}/>
                                <small className="form-text text-muted">
                                    The max length in minutes of a song that can be queued. -1 to disable
                                </small>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="form-group">
                                <label><b>Allow Playlists</b></label>
                                <select className="form-control" name="music_playlists"
                                        value={this.state.music_playlists} onChange={this.onChange}>
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                </select>
                                <small className="form-text text-muted">
                                    If users are allowed to queue playlists
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}