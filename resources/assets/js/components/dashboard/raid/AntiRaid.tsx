import React from 'react';
import {Tab} from "../tabs";
import {useGuildSetting} from "../utils/hooks";
import {DashboardSwitch} from "../../DashboardInput";
import DetectionSettings from "./DetectionSettings";
import AlertSettings from "./AlertSettings";
import reducer from "./reducer";
import raidRootSaga from "./saga";
import PastRaids from "./PastRaids";

const AntiRaid: React.FC = () => {

    const [raidEnabled, setRaidEnabled] = useGuildSetting(window.Panel.Server.id, 'anti_raid_enabled', false, true);

    return (
        <React.Fragment>
            <h2>Anti-Raid Settings</h2>
            <p>
                Raid reports are kept for a maximum of 30 days after the raid.
            </p>
            <DashboardSwitch label="Master Switch" id="master-switch" checked={raidEnabled} onChange={e => setRaidEnabled(e.target.checked)}/>
            <hr/>
            <h2>Detection Settings</h2>
            <div className="row">
                <div className="col-12">
                    <DetectionSettings/>
                </div>
            </div>
            <hr/>
            <h2>Alert Settings</h2>
            <div className="row">
                <div className="col-12">
                   <AlertSettings/>
                </div>
            </div>
            <hr/>
            <h2>Recent Raids</h2>
            <div className="row">
                <div className="col-12">
                    <PastRaids/>
                </div>
            </div>
        </React.Fragment>
    )
};

const tab: Tab = {
    key: 'antiraid',
    name: 'Anti-Raid',
    icon: 'shield-alt',
    route: {
        path: '/raid',
        component: AntiRaid
    },
    reducer: reducer,
    saga: raidRootSaga
};

export default tab;