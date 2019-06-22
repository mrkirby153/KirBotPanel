import React, {Component} from 'react';
import SpamRule from "./spam/SpamRule";
import {DashboardInput, DashboardSelect} from "../DashboardInput";
import SettingsRepository from "../../settings_repository";


interface SpamState {
    punishment: string,
    punishment_duration: string,
    clean_amount: string,
    clean_duration: string,
    rules: any[]
}

/*
    TODO:
        * Clicking on the "level" thing lets them change the level
        * Clicking on the big "+" creates a new level which is editing and the number is focused
        * Clicking "Save" commits the json to the backend
 */


const new_rule = {
    level: "",
    _id: "",
    data: []
};


function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default class Spam extends Component<{}, SpamState> {

    constructor(props) {
        super(props);

        // @ts-ignore
        this.state = this.explodeJson(SettingsRepository.getSetting("spam_settings", {}));

        this.onRuleChange = this.onRuleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.addNewRule = this.addNewRule.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.changeLevel = this.changeLevel.bind(this);
    }

    onRuleChange(key, data) {
        let dcopy = [...data];
        let prevRules = [...this.state.rules];
        for (let i = 0; i < prevRules.length; i++) {
            if (prevRules[i]._id == key) {
                console.log(dcopy);
                prevRules[i] = {
                    ...prevRules[i],
                    data: dcopy
                };
            }
        }
        console.log(prevRules);
        this.setState({
            rules: prevRules
        });
    }

    buildSpamJson() {
        let keys = ["punishment", "punishment_duration", "clean_amount", "clean_duration"];
        let json = {};
        keys.forEach(key => {
            if (this.state[key]) {
                json[key] = this.state[key]
            }
        });
        this.state.rules.forEach(rule => {
            let ruleJson = {};
            rule.data.forEach(data => {
                if (data.count !== "" && data.period !== "") {
                    ruleJson[data.name] = {
                        count: parseInt(data.count),
                        period: parseInt(data.period)
                    }
                }
            });
            json[rule.level] = ruleJson;
        });
        return json;
    }

    onChange(e) {
        let {name, value} = e.target;

        // @ts-ignore
        this.setState({
            [name]: value
        })
    }

    addNewRule() {
        let rules = [...this.state.rules];
        rules.push({
            ...new_rule,
            _id: makeid(5)
        });
        this.setState({
            rules: rules
        })
    }

    changeLevel(id, newLevel) {
        console.log(`Updating level of ${id} to ${newLevel}`);
        let rules = [...this.state.rules];
        rules.forEach(rule => {
            if(rule._id == id) {
                rule.level = newLevel
            }
        });
        this.setState({
            rules: rules
        })
    }

    deleteRule(id) {
        console.log("Deleting rule " + id);
        let rules: any[] = [];
        this.state.rules.forEach(rule => {
            if (rule._id != id) {
                rules.push(rule)
            }
        });
        this.setState({
            rules: rules
        })
    }


    explodeJson(json) {
        let keys = Object.keys(json);
        let newState = {};
        let newRules: any[] = [];
        keys.forEach(key => {
            if (key == "punishment" || key == "punishment_duration" || key == "clean_amount" || key == "clean_duration") {
                newState = {
                    ...newState,
                    [key]: json[key]
                }
            }

            // We hit a clearance level
            if (!isNaN(parseInt(key))) {
                let level = key;

                // Clearance level rule
                let rules = json[key];

                let id = json[key]["_id"];
                if (!id) {
                    id = makeid(5)
                }

                let rule_data = Object.keys(rules).filter(e => e != "_id").map(rule => {
                    return {
                        name: rule,
                        count: rules[rule]["count"],
                        period: rules[rule]["period"]
                    }
                });
                newRules.push({
                    level: parseInt(level),
                    _id: id,
                    data: rule_data
                })
            }
        });
        return {
            ...newState,
            rules: newRules
        }
    }

    render() {
        let rules = this.state.rules ? this.state.rules.map(rule => {
            return <SpamRule key={rule._id} level={rule.level} data={rule.data}
                             onChange={e => this.onRuleChange(rule._id, e)} id={rule._id}
                             onDeleteRule={() => this.deleteRule(rule._id)} onLevelChange={this.changeLevel}/>
        }) : [];
        return (
            <div>
                <code>
                    {JSON.stringify(this.buildSpamJson(), null, 5)}
                </code>
                <div className="spam-rules">
                    {rules}
                </div>
                <button className="w-100 btn btn-outline-info" onClick={this.addNewRule}><i className="fas fa-plus"/>
                </button>
                <hr/>
                <form>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                            <label htmlFor="punishment">Punishment</label>
                            <DashboardSelect id="punishment" name="punishment" className="form-control"
                                             value={this.state.punishment} onChange={this.onChange}>
                                <option value={"NONE"}>No Action</option>
                                <option value={"MUTE"}>Mute the user</option>
                                <option value={"KICK"}>Kick the user</option>
                                <option value={"BAN"}>Ban the user</option>
                                <option value={"TEMPBAN"}>Temporarily ban the user</option>
                                <option value={"TEMPMUTE"}>Temporarily mute the user</option>
                            </DashboardSelect>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="punishment_duration">Punishment Duration</label>
                            <div className="input-group">
                                <DashboardInput name="punishment_duration" type="number" className="form-control"
                                                value={this.state.punishment_duration} onChange={this.onChange}/>
                                <div className="input-group-append">
                                    <div className="input-group-text">Seconds</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="clean_amount">Clean Amount</label>
                            <div className="input-group">
                                <div className="input-group-append">
                                    <DashboardInput name="clean_amount" type="number" className="form-control"
                                                    value={this.state.clean_amount} onChange={this.onChange}/>
                                    <div className="input-group-text">Messages</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="clean_duration">Clean Duration</label>
                            <div className="input-group">
                                <DashboardInput name="clean_duration" type="number" className="form-control"
                                                value={this.state.clean_duration} onChange={this.onChange}/>
                                <div className="input-group-append">
                                    <div className="input-group-text">Seconds</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-row mt-2">
                        <button className="btn btn-success">Save</button>
                    </div>
                </form>
            </div>
        )
    }
}