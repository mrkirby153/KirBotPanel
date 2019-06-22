import React, {RefObject} from 'react';
import {DashboardInput} from "../../DashboardInput";

interface SpamItemProps {
    name: string,
    count: number | string,
    period: number | string,
    onChange?: Function
}

interface SpamRuleComponentState {
    editing: boolean,
    level: string | number
}

interface SpamRuleComponentProps {
    id: string,
    level: number | string,
    data: SpamItemProps[],
    onChange?: Function,
    onDeleteRule?: Function,
    onLevelChange?: Function
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

        if (this.props.onChange) {
            this.props.onChange(newState);
        }
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

export default class SpamRule extends React.Component<SpamRuleComponentProps, SpamRuleComponentState> {

    private inputRef: RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            level: ""
        };

        this.inputRef = React.createRef();

        this.onChange = this.onChange.bind(this);
        this.deleteRule = this.deleteRule.bind(this);
        this.updateEditingState = this.updateEditingState.bind(this);
        this.onLevelChange = this.onLevelChange.bind(this);
        this.startEditing = this.startEditing.bind(this);
        this.stopEditing = this.stopEditing.bind(this);
    }

    onChange(key, data) {
        let rules = [...this.props.data];

        let found = false;
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (rule.name == key) {
                found = true;
                rules[i] = {
                    ...rule,
                    ...data
                }
            }
        }
        if (!found) {
            rules.push({...data, name: key});
        }

        if (this.props.onChange) {
            this.props.onChange(rules);
        }
    }

    onLevelChange(e) {
        let {value} = e.target;
        this.setState({
            level: value
        });
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

    componentDidMount(): void {
        this.updateEditingState();
    }

    deleteRule() {
        if (this.props.onDeleteRule) {
            this.props.onDeleteRule(this.props.id);
        }
    }

    updateEditingState() {
        if (this.props.level === "" && !this.state.editing) {
            this.startEditing();
        }
    }

    startEditing() {
        this.setState({
            level: this.props.level,
            editing: true
        });
        const ref = this.inputRef.current;
        if (ref) {
            setTimeout(() => {
                ref.focus();
            }, 100)
        }
    }

    stopEditing() {
        this.setState({
            editing: false
        });
        // Propagate the change out
        if (this.props.onLevelChange) {
            this.props.onLevelChange(this.props.id, this.state.level);
        }
    }

    render() {
        let items = Object.keys(rule_localizations).map(key => {
            let data = this.getSpamData(key);
            return <SpamItem name={key} key={key} count={data.count} period={data.period}
                             onChange={e => this.onChange(key, e)}/>
        });
        return (
            <div className="spam-rule">
                <div className="form-row" style={!this.state.editing ? {display: "none"} : {}}>
                    <div className="col-auto">
                        <div className="input-group input-group-sm">
                            <div className="input-group-prepend">
                                <div className="input-group-text">Level</div>
                            </div>
                            <DashboardInput type="number" value={this.state.level} onChange={this.onLevelChange}
                                            className="form-control form-control-sm" ref={this.inputRef}
                                            onBlur={this.stopEditing}/>
                        </div>
                    </div>
                </div>
                <span className="level" style={this.state.editing ? {display: "none"} : {}}
                      onClick={this.startEditing}>{this.props.level}</span>
                {!this.state.editing &&
                <div className="delete-button" onClick={this.deleteRule}><i className="fas fa-minus-square"/></div>}
                <div className="spam-items">
                    {items}
                </div>
            </div>
        );
    }
}