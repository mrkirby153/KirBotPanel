import React, {Component} from 'react';
import SpamRule from "./spam/SpamRule";
import {DashboardInput, DashboardSelect} from "../DashboardInput";


interface SpamState {
    punishment: string,
    punishment_duration: string,
    clean_amount: string,
    clean_duration: string,
    rules: any[]
}

export default class Spam extends Component<{}, SpamState> {

    constructor(props) {
        super(props);
        let mock_data = {
            punishment: 'TEMPMUTE',
            punishment_duration: 30,
            clean_amount: 4,
            clean_duration: 10,
            rules: [
                {
                    level: 0,
                    data: [
                        {
                            name: "max_links",
                            count: 10,
                            period: 60
                        },
                        {
                            name: "max_messages",
                            count: 7,
                            period: 10
                        },
                        {
                            name: "max_newlines",
                            count: 30,
                            period: 120
                        },
                        {
                            name: "max_mentions",
                            count: 10,
                            period: 10
                        },
                        {
                            name: "max_duplicates",
                            count: 6,
                            period: 30
                        },
                        {
                            name: "max_attachments",
                            count: 5,
                            period: 120
                        }
                    ]
                }
            ]
        };
        // @ts-ignore
        this.state = {...mock_data};

        this.onRuleChange = this.onRuleChange.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onRuleChange(key, data) {
        let prevRules = [...this.state.rules];
        for (let i = 0; i < prevRules.length; i++) {
            if (prevRules[i].level == key) {
                prevRules[i] = {
                    level: key,
                    data: data
                };
            }
        }
        this.setState({
            rules: prevRules
        });
    }

    buildSpamJson() {
        let json = {
            punishment: this.state.punishment,
            punishment_duration: parseInt(this.state.punishment_duration),
            clean_amount: this.state.clean_amount,
            clean_duration: this.state.clean_duration
        };
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

    render() {
        let rules = this.state.rules.map(rule => {
            return <SpamRule key={rule.level} level={rule.level} data={rule.data}
                             onChange={e => this.onRuleChange(rule.level, e)}/>
        });
        return (
            <div>
                <code>
                    {JSON.stringify(this.buildSpamJson(), null, 5)}
                </code>
                <div className="spam-rules">
                    {rules}
                </div>
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
                            <DashboardInput name="punishment_duration" type="number" className="form-control"
                                            value={this.state.punishment_duration} onChange={this.onChange}/>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="clean_amount">Clean Amount</label>
                            <DashboardInput name="clean_amount" type="number" className="form-control"
                                            value={this.state.clean_amount} onChange={this.onChange}/>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="clean_duration">Clean Duration</label>
                            <DashboardInput name="clean_duration" type="number" className="form-control"
                                            value={this.state.clean_duration} onChange={this.onChange}/>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}