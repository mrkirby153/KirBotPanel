import React, {useEffect, useState} from 'react';
import {Tab} from "../tabs";
import reducer from "./reducer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useDispatch} from "react-redux";
import {useGuildSetting} from "../utils/hooks";
import {CensorSettings} from "./types";
import ld_isEqual from 'lodash/isEqual';
import * as Actions from './actions';
import {useTypedSelector} from "../reducers";
import CensorRule from "./CensorRule";
import toastr from 'toastr';

const Censor: React.FC = () => {

    const dispatch = useDispatch();

    const defaultCensorSettings = {
        rules: []
    };

    const reducerCensorSettings = useTypedSelector(state => state.censor.rules);
    const changed = useTypedSelector(state => state.censor.changed);

    const [censorSettings, setCensorSettings] = useGuildSetting<CensorSettings>(window.Panel.Server.id, 'censor_settings', defaultCensorSettings, true)

    const [lastSaved, setLastSaved] = useState();

    const loadSettings = (settings: CensorSettings) => {
        if (!ld_isEqual(lastSaved, settings)) {
            dispatch(Actions.loadCensorRules(settings.rules));
            setLastSaved({...settings});
        }
    };

    const updateSettings = () => {
        setLastSaved(null);
        setCensorSettings({
            rules: reducerCensorSettings
        });
        toastr.success('Settings saved!');
    };


    useEffect(() => {
        loadSettings({...censorSettings})
    }, [censorSettings]);

    const components = reducerCensorSettings.map(setting => {
        if (setting._id)
            return <CensorRule id={setting._id} key={setting._id}/>
    });

    return (
        <React.Fragment>
            {components}
            <button className="w-100 btn btn-outline-info" disabled={window.Panel.Server.readonly}
                    onClick={() => dispatch(Actions.createCensorRule())}>
                <FontAwesomeIcon icon={"plus"}/>
            </button>
            {!window.Panel.Server.readonly && changed && <div className="form-row mt-2">
                <button className="btn btn-success" disabled={window.Panel.Server.readonly}
                        onClick={updateSettings}>Save
                </button>
            </div>}
        </React.Fragment>
    )
};

const tab: Tab = {
    key: 'censor',
    name: 'Censor',
    icon: 'trash',
    route: {
        path: '/censor',
        component: Censor
    },
    reducer: reducer
};

export default tab;