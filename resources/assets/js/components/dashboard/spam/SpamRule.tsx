import React from 'react';
import {DashboardInput} from "../../DashboardInput";

interface SpamItemProps {
    name: string,
    count: number | string,
    period: number | string,
    onChange?: Function
}

interface SpamRuleComponentProps {
    level: number,
    data: SpamItemProps[],
    onChange?: Function
}

const rule_localizations = {
    "max_links": "Max Links",
    "max_messages": "Max Messages",
    "max_newlines": "Max Newlines",
    "max_mentions": "Max Mentions",
    "max_duplicates": "Max Duplicates",
    "max_attachments": "Max Attachments"
};


function getLocalizedRule(name): string {
    if (rule_localizations.hasOwnProperty(name)) {
        return rule_localizations[name];
    } else {
        return name;
    }
}

class SpamItem extends React.Component<SpamItemProps, {}> {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        let {name, value} = e.target;

        let newState = {
            ...this.state,
            [name]: value
        };

        // @ts-ignore
        if (this.props.onChange)
            this.props.onChange(newState);
    }

    render() {
        return (
            <div className="spam-item">
                <h5 className="spam-label">{getLocalizedRule(this.props.name)}</h5>
                <form>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                            <label htmlFor="count">Count</label>
                            <DashboardInput type="number" placeholder="Count" value={this.props.count} name="count"
                                            className="form-control" onChange={this.onChange}/>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="period">Period</label>
                            <DashboardInput type="number" placeholder="Period" value={this.props.period} name="period"
                                            className="form-control" onChange={this.onChange}/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default class SpamRule extends React.Component<SpamRuleComponentProps, {}> {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(key, data) {

        let rules = [...this.props.data];

        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (rule.name == key) {
                rules[i] = {
                    ...rule,
                    ...data
                }
            }
        }

        if (this.props.onChange) {
            this.props.onChange(rules);
        }
    }


    getSpamData(key) {
        let toReturn: any = null;
        this.props.data.forEach(e => {
            if (e.name == key) {
                toReturn = e;
            }
        });
        if (toReturn == null) {
            return {
                count: "",
                period: ""
            }
        } else {
            return toReturn
        }
    }

    render() {
        let items = Object.keys(rule_localizations).map(key => {
            let data = this.getSpamData(key);
            return <SpamItem name={key} count={data.count} period={data.period}/>
        });
        return (
            <div className="spam-rule">
                <span className="level"> {this.props.level}</span>
                <div className="spam-items">
                    {items}
                </div>
            </div>
        );
    }
}