import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../reducers";
import ld_find from 'lodash/find';
import ld_defer from 'lodash/defer';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SpamRuleSetting} from "./types";
import Field from "../../Field";
import {DashboardInput} from "../../DashboardInput";
import * as Actions from './actions';
import Swal from "sweetalert2";

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
                            <DashboardInput type="number" placeholder="Count" className="form-control"
                                            value={setting.count}
                                            onChange={e => dispatch(Actions.setSpamItem(props.id, props.name, 'count', e.target.value))}/>
                        </Field>
                    </div>
                    <div className="col-auto">
                        <Field>
                            <label>Period</label>
                            <div className="input-group">
                                <DashboardInput type="number" placeholder="Period" className="form-control"
                                                value={setting.period}
                                                onChange={e => dispatch(Actions.setSpamItem(props.id, props.name, 'period', e.target.value))}/>
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

    const [editing, setEditing] = useState(rule && rule._level == undefined);
    const editRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the text box if undefined
        if (rule && rule._level == "")
            startEditing()
    }, [rule]);

    if (!rule) {
        return null;
    }

    const focusEditor = () => {
        if (editRef.current) {
            if (document.activeElement != editRef.current) {
                let ref = editRef.current;
                ld_defer(() => {
                    ref.focus();
                })
            }
        }
    };

    const startEditing = () => {
        setEditing(true);
        focusEditor();
    };

    const stopEditing = () => {
        if (!rule._level) {
            // Prevent defocusing if invalid
            focusEditor();
        } else {
            setEditing(false)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode == 13) {
            // Enter was pressed, stop editing
            stopEditing();
        }
    };

    const deleteRule = () => {
        Swal.fire({
            title: 'Delete Rule',
            text: 'Are you sure you want to delete this rule?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true
        }).then(e => {
            if (e.value) {
                dispatch(Actions.deleteSpamRule(props.id))
            }
        })
    };

    if (!rule) {
        return null;
    }

    let items = Object.keys(available_rules).map(key => {
        return <SpamItem name={key} id={props.id} key={key}/>
    });

    let spanStyle = {};
    if (editing) {
        spanStyle["display"] = "none";
    }
    if (window.Panel.Server.readonly) {
        spanStyle["cursor"] = "default";
    }


    return (
        <div className="spam-rule">
            <div className="form-row" style={!editing ? {display: 'none'} : {}}>
                <div className="col-auto">
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Level</div>
                        </div>
                        <DashboardInput type="number" value={rule._level} className="form-control form-control-sm"
                                        onBlur={stopEditing} ref={editRef}
                                        onChange={e => dispatch(Actions.setLevel(props.id, e.target.value))}
                                        onKeyDown={handleKeyDown}/>
                    </div>
                </div>
            </div>
            <span className="level" style={spanStyle} onClick={startEditing}>{rule._level}</span>
            {!window.Panel.Server.readonly && !editing &&
            <FontAwesomeIcon icon={"minus-square"} className="delete-button" onClick={deleteRule}/>}
            <div className="spam-items">
                {items}
            </div>
        </div>
    )
};

export default SpamRule;