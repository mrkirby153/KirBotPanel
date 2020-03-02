import React, {useEffect, useRef, useState} from 'react';
import {useTypedSelector} from "../reducers";
import ld_find from 'lodash/find';
import ld_defer from 'lodash/defer';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Collapse from "../../Collapse";
import Switch from "../../Switch";
import {traverseObject} from "../../../utils";
import {DashboardInput} from "../../DashboardInput";
import {useDispatch} from "react-redux";
import * as Actions from './actions';
import Swal from 'sweetalert2';

interface CensorRuleProps {
    id: string
}

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string,
    open: boolean
}

interface ToggleCaretProps {
    open: boolean
}

interface ListGroupProps {
    id: string,
    section: string
}

const ToggleCaret: React.FC<ToggleCaretProps> = (props) => {
    let className = 'caret';
    className += props.open ? ' caret-open' : '';
    return <FontAwesomeIcon icon={"angle-left"} className={className}/>
};

const Section: React.FC<SectionProps> = (props) => {
    let {name, open, children, ...rest} = props;
    return (
        <React.Fragment>
            <div className="section-header" data-open={open} {...rest}>{name} <ToggleCaret open={open}/></div>
            <Collapse visible={open}>
                {children}
            </Collapse>
            <hr/>
        </React.Fragment>
    )
};

const ListGroup: React.FC<ListGroupProps> = (props) => {
    const rule = useTypedSelector(store => ld_find(store.censor.rules, {_id: props.id}));
    const dispatch = useDispatch();

    const sectionParts: string[] = traverseObject(props.section, rule);

    let components: React.ReactElement[] = [];
    if (sectionParts) {
        sectionParts.forEach((data, index) => {
            components.push(<div className="row" key={index}>
                <div className="col-12 mb-2">
                    <div className="input-group">
                        <DashboardInput type="text" value={data} className="form-control"
                                        onChange={e => dispatch(Actions.modifySection(props.id, props.section, index, e.target.value))}/>
                        {!window.Panel.Server.readonly && <div className="input-group-append">
                           <span className="input-group-text">
                               <FontAwesomeIcon icon={'times'} className="remove-icon"
                                                onClick={() => dispatch(Actions.deleteValue(props.id, props.section, index))}/>
                           </span>
                        </div>}
                    </div>
                </div>
            </div>)
        });
    }
    return (
        <div className="container-fluid">
            {components}
            <button className="btn btn-success" disabled={window.Panel.Server.readonly}
                    onClick={() => dispatch(Actions.addValue(props.id, props.section))}>Add
            </button>
        </div>
    )
};

const CensorRule: React.FC<CensorRuleProps> = (props) => {

    const rule = useTypedSelector(store => ld_find(store.censor.rules, {_id: props.id}));
    const dispatch = useDispatch();

    const [invitesOpen, setInvitesOpen] = useState(false);
    const [domainsOpen, setDomainsOpen] = useState(false);
    const [wordsOpen, setWordsOpen] = useState(false);
    const [editing, setEditing] = useState(false);

    const editRef = useRef<HTMLInputElement>(null);

    const focusLevelEdit = () => {
        if (editRef.current) {
            if (document.activeElement != editRef.current) {
                let ref = editRef.current;
                ld_defer(() => {
                    ref.focus();
                })
            }
        }
    };

    const deleteRule = () => {
        Swal.fire({
            title: 'Delete Rule',
            text: 'Are you sure you want to delete this rule?',
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true
        }).then(e => {
            if (e.value) {
                dispatch(Actions.deleteCensorRule(props.id));
            }
        })
    };

    useEffect(() => {
        if (rule && rule._level == "") {
            startEditing();
        }
    }, [rule]);

    const startEditing = () => {
        setEditing(true);
        focusLevelEdit();
    };

    if (!rule) {
        return null;
    }

    const stopEditing = () => {
        if (!rule._level) {
            focusLevelEdit();
        } else {
            setEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode == 13) {
            // Enter was pressed, stop editing
            stopEditing();
        }
    };

    let spanStyle = {};
    if (editing) {
        spanStyle["display"] = "none";
    }
    if (window.Panel.Server.readonly) {
        spanStyle["cursor"] = "default";
    }

    return (
        <div className="censor-rule">
            <div className="form-row" style={!editing ? {display: 'none'} : {}}>
                <div className="col-auto">
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <div className="input-group-text">Level</div>
                        </div>
                        <DashboardInput type="number" value={rule._level} className="form-control form-control-sm"
                                        onBlur={stopEditing} ref={editRef}
                                        onChange={e => dispatch(Actions.modifyCensorLevel(props.id, e.target.value))}
                                        onKeyDown={handleKeyDown}/>
                    </div>
                </div>
            </div>
            <span className="level" style={spanStyle} onClick={startEditing}>{rule._level}</span>
            {!window.Panel.Server.readonly && !editing &&
            <div className="delete-button" onClick={deleteRule}><FontAwesomeIcon icon="minus-square"/></div>}
            <div className="sections">
                <Section name="Invites" open={invitesOpen} onClick={() => setInvitesOpen(!invitesOpen)}>
                    <Switch id={`invites-enabled-${props.id}`} label="Enabled" switchSize="small"
                            disabled={window.Panel.Server.readonly} checked={rule.invites.enabled}
                            onChange={e => dispatch(Actions.checkValue(props.id, 'invites.enabled', e.target.checked))}/>
                    <div className="row">
                        <div className="col-6">
                            <div className="subsection-header">Guild Whitelist</div>
                            <div className="container-fluid">
                                <ListGroup id={props.id} section="invites.guild_whitelist"/>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="subsection-header">Guild Blacklist</div>
                            <div className="container-fluid">
                                <ListGroup id={props.id} section="invites.guild_blacklist"/>
                            </div>
                        </div>
                    </div>
                </Section>
                <Section name="Domains" open={domainsOpen} onClick={() => setDomainsOpen(!domainsOpen)}>
                    <Switch id={`domains-enabled-${props.id}`} label="Enabled" switchSize="small"
                            disabled={window.Panel.Server.readonly}
                            checked={rule.domains.enabled}
                            onChange={e => dispatch(Actions.checkValue(props.id, 'domains.enabled', e.target.checked))}/>
                    <div className="row">
                        <div className="col-6">
                            <div className="subsection-header">Domain Whitelist</div>
                            <div className="container-fluid">
                                <ListGroup id={props.id} section="domains.whitelist"/>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="subsection-header">Domain Blacklist</div>
                            <div className="container-fluid">
                                <ListGroup id={props.id} section="domains.blacklist"/>
                            </div>
                        </div>
                    </div>
                </Section>
                <Section name="Word Blacklist" open={wordsOpen} onClick={() => setWordsOpen(!wordsOpen)}>
                    <div className="row">
                        <div className="col-6">
                            <div className="subsection-header">Blocked Tokens</div>
                            <ListGroup id={props.id} section="blocked_tokens"/>
                        </div>
                        <div className="col-6">
                            <div className="subsection-header">Blocked Words</div>
                            <ListGroup id={props.id} section="blocked_words"/>
                        </div>
                    </div>
                </Section>
                <Switch id={`zalgo-${props.id}`} label={`Censor Zalgo`} disabled={window.Panel.Server.readonly}
                        checked={rule.zalgo}
                        onChange={e => dispatch(Actions.checkValue(props.id, 'zalgo', e.target.checked))}/>
            </div>
        </div>
    )
};

export default CensorRule;