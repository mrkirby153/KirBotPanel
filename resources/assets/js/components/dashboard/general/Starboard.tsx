import React from 'react';
import {useGuildSetting} from "../utils/hooks";
import {DashboardInput, DashboardSelect, DashboardSwitch} from "../../DashboardInput";
import Field from "../../Field";

const StarboardSettings: React.FC = () => {

    const [starboardEnabled] = useGuildSetting(window.Panel.Server.id, 'starboard_enabled', 0);
    const [channel, setChannel] = useGuildSetting(window.Panel.Server.id, 'starboard_channel_id', '', true);
    const [gildCount, setGildCount] = useGuildSetting(window.Panel.Server.id, 'starboard_gild_count', 0, true);
    const [selfStar, setSelfStar] = useGuildSetting(window.Panel.Server.id, 'starboard_self_star', 0, true);
    const [starCount, setStarCount] = useGuildSetting(window.Panel.Server.id, 'starboard_star_count', 0, true);

    const channels = window.Panel.Server.channels.filter(chan => chan.type == "TEXT").map(chan => <option
        value={chan.id}
        key={chan.id}>#{chan.channel_name}</option>);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <Field>
                        <label>Starboard Channel</label>
                        <DashboardSelect className="form-control" name="channel_id" value={channel}
                                         onChange={e => setChannel(e.target.value)}>
                            <option disabled value={""}>Select a channel</option>
                            {channels}
                        </DashboardSelect>
                    </Field>
                </div>
            </div>
            <div className="row align-items-end">
                <div className="col-4">
                    <Field help="The amount of stars for a post to show up on the starboard">
                        <label>Star Count</label>
                        <DashboardInput type="number" min={0} className="form-control" name="star_count"
                                        value={starCount} onChange={e => setStarCount(parseInt(e.target.value))}
                                        disabled={!starboardEnabled}/>
                    </Field>
                </div>
                <div className="col-4">
                    <Field help="The amount of stars required to gild a post">
                        <label>Gild Count</label>
                        <DashboardInput type="number" min={starCount} className="form-control" name="gild_count"
                                        value={gildCount} onChange={e => setGildCount(parseInt(e.target.value))}
                                        disabled={!starboardEnabled}/>
                    </Field>
                </div>
                <div className="col-4">
                    <Field help="If self starring is enabled, users can star their own messages">
                        <DashboardSwitch label="Self Star" id="self-star" name="self_star" checked={selfStar == 1}
                                         onChange={e => setSelfStar(e.target.checked ? 1 : 0)}
                                         disabled={!starboardEnabled}/>
                    </Field>
                </div>
            </div>
        </React.Fragment>
    )
};

const Starboard: React.FC = () => {
    const [starboardEnabled, enableStarboard] = useGuildSetting(window.Panel.Server.id, 'starboard_enabled', 0, true);

    return (
        <React.Fragment>
            <h2>Starboard</h2>
            <DashboardSwitch label="Enable Starboard" id="enable-starboard" checked={starboardEnabled == 1}
                             onChange={e => enableStarboard(e.target.checked ? 1 : 0)}/>
            <StarboardSettings/>
        </React.Fragment>
    )
};
export default Starboard;