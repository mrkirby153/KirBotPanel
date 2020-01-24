import React from 'react';
import {DashboardInput, DashboardSelect} from "../../DashboardInput";
import Field from "../../Field";
import {useGuildSetting} from "../utils/hooks";

const QueueSettings: React.FC = () => {
    let [maxQueueLength, setMaxQueueLength] = useGuildSetting(window.Panel.Server.id, 'music_max_queue_length', -1, true);
    let [maxSongLength, setMaxSongLength] = useGuildSetting(window.Panel.Server.id, 'music_max_song_length', -1, true);
    let [musicPlaylists, setMusicPlaylists] = useGuildSetting(window.Panel.Server.id, 'music_playlists', 1, true);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Queue Settings</h2>
                <div className="row">
                    <div className="col-lg-4 col-md-12">
                        <Field help="The max length (in minutes) the queue can be. -1 to disable">
                            <label><b>Queue Length</b></label>
                            <DashboardInput type="number" min={-1} className="form-control" value={maxQueueLength}
                                            onChange={e => setMaxQueueLength(parseInt(e.target.value))}/>
                        </Field>
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <Field help="The max length (in minutes) of a song that can be queued. -1 to disable">
                            <label><b>Max Song Length</b></label>
                            <DashboardInput type="number" min={-1} className="form-control" value={maxSongLength}
                                            onChange={e => setMaxSongLength(parseInt(e.target.value))}/>
                        </Field>
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <Field help="If users are allowed to queue playlists">
                            <label><b>Allow Playlists</b></label>
                            <DashboardSelect className="form-control" value={musicPlaylists}
                                             onChange={e => setMusicPlaylists(parseInt(e.target.value))}>
                                <option value={0}>No</option>
                                <option value={1}>Yes</option>
                            </DashboardSelect>
                        </Field>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default QueueSettings;