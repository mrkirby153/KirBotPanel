import React from 'react';
import CensorRule from "./censor/CensorRule";
import {deepClone, makeId} from "../../utils";
import SettingsRepository from "../../settings_repository";
import toastr from 'toastr';


interface CensorState {
    data: any,
    changed: boolean,
    saving: boolean
}

const RULE_TEMPLATE = {
    _id: '',
    level: '',
    data: {
        invites: {
            enabled: false,
            guild_whitelist: [],
            guild_blacklist: []
        },
        domains: {
            enabled: false,
            whitelist: [],
            blacklist: []
        },
        blocked_tokens: [],
        blocked_words: [],
        zalgo: false
    }
};

export default class Censor extends React.Component<{}, CensorState> {

    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            changed: false,
            data: this.explodeJson(SettingsRepository.getSetting('censor_settings'))
        }
    }

    explodeJson = (data) => {
        if (!data) {
            return [];
        }
        let cloned = deepClone(data);
        cloned = Object.keys(cloned).filter(key => key != "_id").map(key => {
            return {
                level: key,
                _id: makeId(5),
                data: cloned[key]
            }
        });
        return cloned;
    };

    onChange = (index, newData) => {
        let newState = deepClone(this.state.data);
        let newObj = {
            _id: this.state.data[index]._id,
            level: this.state.data[index].level,
            data: newData
        };
        newState.splice(index, 1, newObj);
        this.setState({
            data: newState,
            changed: true
        })
    };

    onLevelChange = (index, newLevel) => {
        let newState = [...this.state.data];
        let newObj = {
            _id: this.state.data[index]._id,
            level: newLevel,
            data: this.state.data[index].data
        };
        newState.splice(index, 1, newObj);
        this.setState({
            data: newState,
            changed: true
        })
    };

    deleteRule = (index) => {
        let newState = [...this.state.data];
        newState.splice(index, 1);
        this.setState({
            data: newState,
            changed: true
        })
    };

    addRule = () => {
        let newData = deepClone(this.state.data);
        let data = deepClone(RULE_TEMPLATE);
        data._id = makeId(5);
        newData.push(data);
        this.setState({
            data: newData,
            changed: true
        })
    };

    buildCensorJson = () => {
        let json = {"_id": window.Panel.Server.id};
        this.state.data.forEach(rule => {
            let {level, ...rest} = rule;
            json[level] = rest.data;
        });
        if(this.state.data.length == 0) {
            return {}
        }
        return json;
    };

    saveSettings = () => {
        this.setState({
            saving: true,
        });
        SettingsRepository.setSetting('censor_settings', this.buildCensorJson(), true).then(resp => {
            toastr.success('Settings saved');
            this.setState({
                saving: false,
                changed: false
            })
        });
    };

    render() {
        let components = this.state.data.map((data, index) => {
            return <CensorRule level={data.level} key={data._id} data={data.data}
                               onChange={data => this.onChange(index, data)}
                               onLevelChange={n => this.onLevelChange(index, n)}
                               onDelete={() => this.deleteRule(index)}/>
        });
        return (
            <div>
                {components}
                <button className="w-100 btn btn-outline-info" onClick={this.addRule}><i className="fas fa-plus"/>
                </button>
                {this.state.changed && <div className="form-row mt-2">
                    <button className="btn btn-success" onClick={this.saveSettings} disabled={this.state.saving}>Save
                    </button>
                </div>}
            </div>
        );
    }
}