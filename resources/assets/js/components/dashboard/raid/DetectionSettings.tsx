import React, {Component} from 'react';
import Field from "../../Field";
import _ from 'lodash';
import SettingsRepository from "../../../settings_repository";
import {DashboardInput, DashboardSelect} from "../../DashboardInput";


interface DetectionSettingState {
    anti_raid_count: number,
    anti_raid_period: number,
    anti_raid_quiet_period: number,
    anti_raid_action: string,
}

interface DetectionSettingsProps {
    enabled: boolean
}

export default class DetectionSettings extends Component<DetectionSettingsProps, DetectionSettingState> {
    constructor(props) {
        super(props);

        this.state = SettingsRepository.getMultiple(['anti_raid_count', 'anti_raid_period', 'anti_raid_quiet_period', 'anti_raid_action'], {
            'anti_raid_count': 0,
            'anti_raid_period': 0,
            'anti_raid_quiet_period': 30,
            'anti_raid_action': 'NOTHING'
        });
        this.persistSetting = _.debounce(this.persistSetting.bind(this), 300)
        this.onChange = this.onChange.bind(this);
    }

    persistSetting(key, val) {
        SettingsRepository.setSetting(key, val, true);
    }

    onChange(e) {
        let {name, value} = e.target;
        // @ts-ignore
        this.setState({
            [name]: value
        })
        this.persistSetting(name, value);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-12">
                        <div className="form-row">
                            <div className="col-6">
                                <Field help="The amount of users that have to join">
                                    <label htmlFor="anti_raid_count"><b>Count</b></label>
                                    <DashboardInput type="number" className="form-control" name="anti_raid_count"
                                           id="anti_raid_count"
                                           min={0} value={this.state.anti_raid_count} onChange={this.onChange}
                                           disabled={!this.props.enabled}/>
                                </Field>
                            </div>
                            <div className="col-6">
                                <Field help="The period (in seconds) over which the users have to join">
                                    <label htmlFor="anti_raid_period"><b>Period</b></label>
                                    <DashboardInput type="number" className="form-control" name="anti_raid_period"
                                           id="anti_raid_period"
                                           min={0} value={this.state.anti_raid_period} onChange={this.onChange}
                                           disabled={!this.props.enabled}/>
                                </Field>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-6">
                                <Field help="The action to apply to users who join during an ongoing raid">
                                    <label htmlFor="anti_raid_action"><b>Action</b></label>
                                    <DashboardSelect name="anti_raid_action" className="form-control"
                                            value={this.state.anti_raid_action} onChange={this.onChange}
                                            disabled={!this.props.enabled}>
                                        <option value={'NOTHING'}>No action</option>
                                        <option value={'MUTE'}>Mute</option>
                                        <option value={'KICK'}>Kick</option>
                                        <option value={'BAN'}>Ban</option>
                                    </DashboardSelect>
                                </Field>
                            </div>
                            <div className="col-6">
                                <Field
                                    help="The amount of time (in seconds) between joins and when the raid concludes and report generated">
                                    <label htmlFor="anti_raid_quiet_period"><b>Quiet Period</b></label>
                                    <DashboardInput type="number" className="form-control" name="anti_raid_quiet_period"
                                           onChange={this.onChange} value={this.state.anti_raid_quiet_period}
                                           disabled={!this.props.enabled}/>
                                </Field>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}