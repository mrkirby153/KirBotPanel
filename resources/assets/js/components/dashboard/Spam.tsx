import React, {Component} from 'react';
import SpamRule from "./spam/SpamRule";
import {DashboardInput, DashboardSelect} from "../DashboardInput";


export default class Spam extends Component {

    private mock_data: any;

    constructor(props) {
        super(props);
        this.mock_data = {
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
        }
    }

    render() {
        let rules = this.mock_data.rules.map(rule => {
            return <SpamRule level={rule.level} key={rule.level} data={rule.data}/>
        });
        return (
            <div>
                <div className="spam-rules">
                    {rules}
                </div>
                <form>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                            <label htmlFor="punishment">Punishment</label>
                            <DashboardSelect id="punishment" name="punishment" className="form-control">
                                <option value={"NONE"}>No Action</option>
                                <option value={"MUTE"}>Mute the user</option>
                                <option value={"KICK"}>Kick the user</option>
                                <option value={"BAN"}>Ban the user</option>
                                <option value={"TEMPBAN"}>Temporarily Ban the user</option>
                                <option value={"TEMPMUTE"}>Temporarily Mute the user</option>
                            </DashboardSelect>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="clean-amount">Clean Amount</label>
                            <DashboardInput name="clean-amount" type="number" className="form-control"/>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="clean-duration">Clean Duration</label>
                            <DashboardInput name="clean-duration" type="number" className="form-control"/>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}