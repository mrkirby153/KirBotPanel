import React from 'react';
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../reducers";
import ld_find from 'lodash/find';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SpamRuleSetting} from "./types";
import Field from "../../Field";
import {DashboardInput} from "../../DashboardInput";

interface SpamRuleComponentProps {
    id: string
}

interface SpamItemProps {
    name: string,
    id: string
}

const available_rules = {
    'max_links': 'Max Links',
    'max_messages': 'Max Messages',
    'max_newlines': 'Max Newlines',
    'max_mentions': 'Max Mentions',
    'max_duplicates': 'Max Duplicates',
    'max_attachments': 'Max Attachments'
};

const getRuleName = (name: string): string => {
    if (available_rules.hasOwnProperty(name)) {
        return available_rules[name];
    } else {
        return name;
    }
};

const SpamItem: React.FC<SpamItemProps> = (props) => {
    const dispatch = useDispatch();

    const rule = useTypedSelector(state => {
        return ld_find(state.spam.rules, {_id: props.id})
    });

    const setting: SpamRuleSetting = rule && rule[props.name] ? rule[props.name] as SpamRuleSetting : {
        count: "",
        period: ""
    };

    return (
        <div className="spam-item">
            <h5 className="spam-label">{getRuleName(props.name)}</h5>
            {!setting.count && !setting.period && <div className="disabled-rule">Rule is disabled</div>}
            <form>
                <div className="form-row align-items-center">
                    <div className="col-auto">
                        <Field>
                            <label>Count</label>
                            <DashboardInput type="number" placeholder="Count" className="form-control"/>
                        </Field>
                    </div>
                    <div className="col-auto">
                        <Field>
                            <label>Period</label>
                            <div className="input-group">
                                <DashboardInput type="number" placeholder="Period" className="form-control"/>
                                <div className="input-group-append">
                                    <div className="input-group-text">Seconds</div>
                                </div>
                            </div>
                        </Field>
                    </div>
                </div>
            </form>
        </div>
    );
};

const SpamRule: React.FC<SpamRuleComponentProps> = (props) => {
    const dispatch = useDispatch();

    const rule = useTypedSelector(state => {
        const rules = state.spam.rules;
        return ld_find(rules, {_id: props.id})
    });

    if (!rule) {
        return null;
    }

    let items = Object.keys(available_rules).map(key => {
        return <SpamItem name={key} id={props.id} key={key}/>
    })


    return (
        <div className="spam-rule">
            <span className="level">{rule._level}</span>
            <FontAwesomeIcon icon={"minus-square"} className="delete-button"/>
            <div className="spam-items">
                {items}
            </div>
        </div>
    )
};

export default SpamRule;