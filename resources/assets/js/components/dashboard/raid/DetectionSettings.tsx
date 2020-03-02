import React from 'react';
import Field from "../../Field";
import {DashboardInput, DashboardSelect} from "../../DashboardInput";
import {useGuildSetting} from "../utils/hooks";

const DetectionSettings: React.FC = () => {

    const [enabled] = useGuildSetting(window.Panel.Server.id, 'anti_raid_enabled', false);
    const [count, setCount] = useGuildSetting(window.Panel.Server.id, 'anti_raid_count', 0, true);
    const [period, setPeriod] = useGuildSetting(window.Panel.Server.id, 'anti_raid_period', 0, true);
    const [quietPeriod, setQuietPeriod] = useGuildSetting(window.Panel.Server.id, 'anti_raid_quiet_period', 0, true);
    const [action, setAction] = useGuildSetting(window.Panel.Server.id, 'anti_raid_action', 'NOTHING', true);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-12">
                    <div className="form-row">
                        <div className="col-6">
                            <Field help="The amount of users that have to join">
                                <label htmlFor="anti-raid-count"><b>Count</b></label>
                                <DashboardInput type="number" className="form-control" name="anti-raid-count" min={0}
                                                value={count} onChange={e => setCount(parseInt(e.target.value))}
                                                disabled={!enabled}/>
                            </Field>
                        </div>
                        <div className="col-6">
                            <Field help="The period (in seconds) over which the users have to join">
                                <label htmlFor="anti-raid-period"><b>Period</b></label>
                                <DashboardInput type="number" className="form-control" name="anti-raid-period" min={0}
                                                value={period} onChange={e => setPeriod(parseInt(e.target.value))}
                                                disabled={!enabled}/>
                            </Field>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-6">
                            <Field help="The action to apply to users who join during an ongoing raid">
                                <label htmlFor="anti-raid-action"><b>Action</b></label>
                                <DashboardSelect name="anti-raid-action" className="form-control" disabled={!enabled}
                                                 value={action} onChange={e => setAction(e.target.value)}>
                                    <option value={'NOTHING'}>No Action</option>
                                    <option value={'MUTE'}>Mute</option>
                                    <option value={'KICK'}>Kick</option>
                                    <option value={'BAN'}>Ban</option>
                                </DashboardSelect>
                            </Field>
                        </div>
                        <div className="col-6">
                            <Field help="The amount of time (in seconds) between joins and when the raid concludes">
                                <label htmlFor="anti-raid-quiet-period"><b>Quiet Period</b></label>
                                <DashboardInput type="number" className="form-control" name="anti-raid-quite-period"
                                                disabled={!enabled} value={quietPeriod}
                                                onChange={e => setQuietPeriod(parseInt(e.target.value))}/>
                            </Field>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default DetectionSettings;