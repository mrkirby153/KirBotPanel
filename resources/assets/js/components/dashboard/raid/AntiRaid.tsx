import React, {Component} from 'react';
import DetectionSettings from "./DetectionSettings";
import AlertSettings from "./AlertSettings";
import SettingsRepository from "../../../settings_repository";
import {DashboardSwitch} from "../../DashboardInput";
import PastRaids from "./PastRaids";
import {Tab} from "../tabs";

interface AntiRaidState {
    enabled: boolean
}

class AntiRaid extends Component<{}, AntiRaidState> {
    constructor(props) {
        super(props);

        this.state = {
            enabled: SettingsRepository.getSetting('anti_raid_enabled', 0) == 1
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        let {checked} = e.target;
        this.setState({
            enabled: checked
        });

        SettingsRepository.setSetting('anti_raid_enabled', checked, true);
    }

    render() {
        return (
            <div>
                <h2>Anti-Raid Settings</h2>

                <p>Raid reports are kept for a maximum of 30 days after the raid.</p>
                <DashboardSwitch id="master-switch" label="Master Switch" checked={this.state.enabled} onChange={this.onChange}/>
                <hr/>
                <h2>Detection Settings</h2>
                <div className="row">
                    <div className="col-12">
                        <DetectionSettings enabled={this.state.enabled}/>
                    </div>
                </div>
                <hr/>
                <h2>Alert Settings</h2>
                <div className="row">
                    <div className="col-12">
                        <AlertSettings enabled={this.state.enabled}/>
                    </div>
                </div>
                <hr/>
                <h2>Recent Raids</h2>
                <div className="row">
                    <div className="col-12">
                        <PastRaids/>
                    </div>
                </div>
            </div>
        )
    }
}

const tab: Tab = {
    key: 'anti-raid',
    name: 'Anti-Raid',
    icon: 'shield-alt',
    route: {
        path: '/raid',
        component: AntiRaid
    }
};

export default tab;