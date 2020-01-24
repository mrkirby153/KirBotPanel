import React from 'react';
import {DashboardInput} from "../../DashboardInput";
import Field from "../../Field";
import {useGuildSetting} from "../utils/hooks";

const SkipSettings: React.FC = () => {

    const [cooldown, setCooldown] = useGuildSetting(window.Panel.Server.id, 'music_skip_cooldown', 0);
    const [skipTimer, setSkipTimer] = useGuildSetting(window.Panel.Server.id, 'music_skip_timer', 30);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <h2>Skip Settings</h2>
                    <p>
                        Configure settings for vote skipping
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="col-6">
                    <Field>
                        <DashboardInput type="number" min={0} className="form-control" value={cooldown}
                                        onChange={e => setCooldown(parseInt(e.target.value))}/>
                    </Field>
                </div>
                <div className="col-6">
                    <Field>
                        <DashboardInput type="number" min={0} className="form-control" value={skipTimer}
                                        onChange={e => setSkipTimer(parseInt(e.target.value))}/>
                    </Field>
                </div>
            </div>
        </React.Fragment>
    )
};

export default SkipSettings;