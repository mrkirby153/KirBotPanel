import React, {FormEvent, useEffect, useState} from 'react';
import {Tab} from "../tabs";
import reducer from "./reducer";
import spamRootSaga from "./saga";
import {useDispatch} from "react-redux";
import {useGuildSetting} from "../utils/hooks";
import * as Actions from './actions';
import {SpamPunishment, SpamSettings} from "./types";
import {useTypedSelector} from "../reducers";
import {DashboardInput, DashboardSelect} from "../../DashboardInput";
import ld_isEqual from 'lodash/isEqual';
import SpamRule from "./SpamRule";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import toastr from 'toastr';

const Spam: React.FC = () => {
    const dispatch = useDispatch();

    const storeSettings = useTypedSelector(state => state.spam);

    const spamDefaults: SpamSettings = {
        punishment_duration: "",
        punishment: SpamPunishment.NONE,
        clean_duration: "",
        clean_amount: "",
        rules: []
    };

    const [spamSettings, setSpamSettings] = useGuildSetting<SpamSettings>(window.Panel.Server.id, 'spam_settings', spamDefaults, true);

    const [lastLoaded, setLastLoaded] = useState<any>(null);

    const loadSpamRules = () => {
        if (!ld_isEqual(lastLoaded, spamSettings)) {
            dispatch(Actions.loadSpamRules(spamSettings.rules || [], spamSettings.punishment || SpamPunishment.NONE, spamSettings.punishment_duration, spamSettings.clean_duration, spamSettings.clean_amount))
            setLastLoaded({...spamSettings});
        }
    };

    useEffect(() => {
        loadSpamRules();
    }, [spamSettings]);

    let rules = storeSettings.rules.map(rule => {
        if (rule._id)
            return <SpamRule id={rule._id} key={rule._id}/>
    });

    const save = (e: FormEvent) => {
        e.preventDefault();
        let {changed, ...rest} = storeSettings;
        setSpamSettings({...rest});
        toastr.success('Settings Saved!');
    };

    return (
        <React.Fragment>
            <div className="spam-rules">
                {rules}
            </div>
            <button className="w-100 btn btn-outline-info" onClick={() => dispatch(Actions.createSpamRule())}>
                <FontAwesomeIcon icon={"plus"}/>
            </button>
            <hr/>
            <form onSubmit={save}>
                <div className="form-row align-items-center">
                    <div className="col-auto">
                        <label htmlFor="punishment">Punishment</label>
                        <DashboardSelect id="punishment" className="form-control" value={storeSettings.punishment}
                                         onChange={t => dispatch(Actions.setPunishment(SpamPunishment[t.target.value]))}>
                            <option value={SpamPunishment.NONE}>No Action</option>
                            <option value={SpamPunishment.MUTE}>Mute the user</option>
                            <option value={SpamPunishment.KICK}>Kick the user</option>
                            <option value={SpamPunishment.BAN}>Ban the user</option>
                            <option value={SpamPunishment.TEMP_BAN}>Tempban the user</option>
                            <option value={SpamPunishment.TEMP_MUTE}>Tempmute the user</option>
                        </DashboardSelect>
                    </div>
                    <div className="col-auto">
                        <label htmlFor="punish-duration">Punishment Duration</label>
                        <div className="input-group">
                            <DashboardInput name="punish-duration" type="number" className="form-control"
                                            value={storeSettings.punishment_duration?.toString()}
                                            onChange={e => dispatch(Actions.setPunishKey('punishment_duration', e.target.value))}/>
                            <div className="input-group-append">
                                <div className="input-group-text">Seconds</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <label htmlFor="clean-amount">Clean Amount</label>
                        <div className="input-group">
                            <DashboardInput name="clean-amount" type="number" className="form-control"
                                            value={storeSettings.clean_amount?.toString()}
                                            onChange={e => dispatch(Actions.setPunishKey('clean_amount', e.target.value))}/>
                            <div className="input-group-append">
                                <div className="input-group-text">Messages</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <label htmlFor="clean-duration">Clean Duration</label>
                        <div className="input-group">
                            <DashboardInput name="clean-duration" type="number" className="form-control"
                                            value={storeSettings.clean_duration?.toString()}
                                            onChange={e => dispatch(Actions.setPunishKey('clean_duration', e.target.value))}/>
                            <div className="input-group-append">
                                <div className="input-group-text">Seconds</div>
                            </div>
                        </div>
                    </div>
                </div>
                {!window.Panel.Server.readonly && storeSettings.changed && <div className="form-row mt-2">
                    <button className="btn btn-success" type="submit">Save</button>
                </div>}
            </form>
        </React.Fragment>
    );
};

const tab: Tab = {
    key: 'spam',
    name: 'Spam',
    icon: 'fire-extinguisher',
    route: {
        path: '/spam',
        component: Spam
    },
    reducer: reducer,
    saga: spamRootSaga
};

export default tab;