import React from 'react';
import {DashboardInput} from "../../DashboardInput";

interface SpamItemProps {
    name: string,
    count: number,
    period: number
}

interface SpamRuleComponentProps {
    level: number,
    data: SpamItemProps[]
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
    }

    render() {
        return (
            <div className="spam-item">
                <h5 className="spam-label mt-2">{getLocalizedRule(this.props.name)}</h5>
                <form>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                            <label htmlFor="count">Count</label>
                            <DashboardInput type="number" placeholder="Count" value={this.props.count} name="count"
                                            className="form-control"/>
                        </div>
                        <div className="col-auto">
                            <label htmlFor="period">Period</label>
                            <DashboardInput type="number" placeholder="Period" value={this.props.period} name="period"
                                            className="form-control"/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default class SpamRule extends React.Component<SpamRuleComponentProps, {}> {
    private mock_data: any;

    constructor(props) {
        super(props);
    }

    render() {
        let items = this.props.data.map(data => {
            return <SpamItem name={data.name} key={data.name} count={data.count} period={data.period}/>
        });
        return (
            <div className="spam-rule">
                <span className="level">{this.props.level}</span>
                <div className="spam-items">
                    {items}
                </div>
            </div>
        );
    }
}