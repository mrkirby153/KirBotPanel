import React from 'react';
import Collapse from "../../Collapse";
import Switch from "../../Switch";
import {deepClone, setObject, traverseObject} from "../../../utils";
import {DashboardInput} from "../../DashboardInput";
import Swal from 'sweetalert2';

interface CensorRuleProps {
    level: string,
    data: {
        invites: {
            enabled: boolean,
            guild_whitelist: string[],
            guild_blacklist: string[]
        },
        domains: {
            enabled: boolean,
            whitelist: string[],
            blacklist: string[]
        },
        blocked_tokens: string[],
        blocked_words: string[],
        zalgo: boolean
    },
    onChange?: Function,
    onLevelChange?: (n: string) => void,
    onDelete?: () => void;
}

interface CensorRuleState {
    level: string,
    editing: boolean,
    domainsVisible: boolean,
    invitesVisible: boolean,
    wordsVisible: boolean
}

interface ToggleCaretProps {
    open: boolean
}

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string,
    open: boolean
}

const ToggleCaret: React.FC<ToggleCaretProps> = ({open}) => {
    let className = 'caret';
    className += open ? ' caret-open' : '';
    return <span className={className}><i className="fas fa-angle-left caret-inner"/></span>
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
    );
};


interface ListGroupProps {
    data: string[],
    addItem: () => void,
    removeItem: (n: number) => void;
    editItem: (n: number, value: string) => void;
}

const ListGroup: React.FC<ListGroupProps> = (props) => {
    const onChange = (n, e) => {
        let value = e.target.value;
        props.editItem(n, value);
    };
    let components: React.ReactElement[] = [];
    if (props.data) {
        props.data.forEach((data, index) => {
            components.push(<div className="row" key={index}>
                <div className="col-6 mb-2">
                    <div className="input-group">
                        <DashboardInput type="text" value={data} className="form-control"
                                        onChange={e => onChange(index, e)}/>
                        {!window.Panel.Server.readonly && <div className="input-group-append">
                        <span className="input-group-text"><span onClick={() => {
                            props.removeItem(index)
                        }}><i className="fas fa-times remove-button"/></span></span>
                        </div>}
                    </div>
                </div>
            </div>)
        });
    }
    return (
        <div className="container-fluid">
            {components}
            <button className="btn btn-success" onClick={props.addItem} disabled={window.Panel.Server.readonly}>Add
            </button>
        </div>);
};

export default class CensorRule extends React.Component<CensorRuleProps, CensorRuleState> {

    private readonly inputRef: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);
        this.state = {
            level: this.props.level,
            editing: false,
            domainsVisible: false,
            invitesVisible: false,
            wordsVisible: false,
        };

        this.inputRef = React.createRef();
    }

    toggleSection = (section) => {
        let sectionName = `${section}Visible`;
        let prev = this.state[sectionName];
        // @ts-ignore
        this.setState({
            [sectionName]: !prev
        })
    };


    removeItem = (key, index) => {
        let newData = deepClone(this.props.data);
        traverseObject(key, newData).splice(index, 1);
        this.emitChange(newData);
    };

    editItem = (key, index, newVal) => {
        let newData = deepClone(this.props.data);
        traverseObject(key, newData).splice(index, 1, newVal);
        this.emitChange(newData);
    };

    addItem = (key) => {
        let newData = deepClone(this.props.data);
        let arr = traverseObject(key, newData);
        if (arr) {
            arr.push("")
        } else {
            setObject(key, newData, [""]);
        }
        this.emitChange(newData);
    };

    onZalgoChange = (e) => {
        let newData = deepClone(this.props.data);
        newData.zalgo = e.target.checked;
        this.emitChange(newData);
    };

    emitChange = (data) => {
        if (this.props.onChange) {
            this.props.onChange(data);
        }
    };

    onLevelChange = (e) => {
        this.setState({
            level: e.target.value
        });
    };

    startEditing = () => {
        this.setState({
            editing: true,
            level: this.props.level
        });
        const ref = this.inputRef.current;
        if (ref) {
            setTimeout(() => {
                ref.focus();
            }, 100);
        }
    };

    stopEditing = () => {
        this.setState({
            editing: false
        });
        if (this.props.onLevelChange) {
            this.props.onLevelChange(this.state.level);
        }
    };

    deleteRule = () => {
        Swal.fire({
            title: 'Delete Rule',
            text: 'Are you sure you want to delete this rule?',
            type: 'warning',
            showConfirmButton: true,
            showCancelButton: true
        }).then(e => {
            if (e.value) {
                if (this.props.onDelete) {
                    this.props.onDelete();
                }
            }
        });
    };

    updateEditingState = () => {
        if (this.props.level === "" && !this.state.editing) {
            this.startEditing();
        }
    };

    componentDidMount(): void {
        this.updateEditingState();
    }

    onCheckChange = (target, e) => {
        let newData = deepClone(this.props.data);
        setObject(`${target}.enabled`, newData, e.target.checked);
        this.emitChange(newData);
    };

    render() {
        let spanStyle = {};
        if(this.state.editing) {
            spanStyle["display"] = "none";
        }
        if(window.Panel.Server.readonly) {
            spanStyle["cursor"] = "default";
        }
        return (
            <div className="censor-rule">
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
                <span className="level" style={spanStyle}
                      onClick={this.startEditing}>{this.props.level}</span>
                {!window.Panel.Server.readonly && !this.state.editing &&
                <div className="delete-button" onClick={this.deleteRule}><i className="fas fa-minus-square"/></div>}
                <div className="sections">
                    <Section name="Invites" open={this.state.invitesVisible}
                             onClick={() => this.toggleSection('invites')}>
                        <Switch id="invites-enabled" label="Enabled" switchSize="small"
                                checked={this.props.data.invites.enabled}
                                onChange={e => this.onCheckChange('invites', e)}
                                disabled={window.Panel.Server.readonly}/>
                        <div className="row">
                            <div className="col-6">
                                <div className="subsection-header">Guild Whitelist</div>
                                <div className="container-fluid">
                                    <ListGroup data={this.props.data.invites.guild_whitelist} addItem={() => {
                                        this.addItem('invites.guild_whitelist');
                                    }} removeItem={n => {
                                        this.removeItem('invites.guild_whitelist', n);
                                    }} editItem={(n, value) => {
                                        this.editItem('invites.guild_whitelist', n, value)
                                    }}/>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="subsection-header">Guild Blacklist</div>
                                <div className="container-fluid">
                                    <ListGroup data={this.props.data.invites.guild_blacklist} addItem={() => {
                                        this.addItem('invites.guild_blacklist')
                                    }} removeItem={n => {
                                        this.removeItem('invites.guild_blacklist', n);
                                    }} editItem={(n, value) => {
                                        this.editItem('invites.guild_blacklist', n, value);
                                    }}/>
                                </div>
                            </div>
                        </div>
                    </Section>
                    <Section name="Domains" open={this.state.domainsVisible}
                             onClick={() => this.toggleSection('domains')}>
                        <Switch id="domains-enabled" label="Enabled" switchSize="small"
                                checked={this.props.data.domains.enabled}
                                onChange={e => this.onCheckChange('domains', e)}
                                disabled={window.Panel.Server.readonly}/>
                        <div className="row">
                            <div className="col-6">
                                <div className="subsection-header">Domain Whitelist</div>
                                <ListGroup data={this.props.data.domains.whitelist} addItem={() => {
                                    this.addItem('domains.whitelist')
                                }} removeItem={n => {
                                    this.removeItem('domains.whitelist', n);
                                }} editItem={(n, value) => {
                                    this.editItem('domains.whitelist', n, value);
                                }}/>
                            </div>
                            <div className="col-6">
                                <div className="subsection-header">Domain Blacklist</div>
                                <ListGroup data={this.props.data.domains.blacklist} addItem={() => {
                                    this.addItem('domains.blacklist')
                                }} removeItem={n => {
                                    this.removeItem('domains.blacklist', n);
                                }} editItem={(n, value) => {
                                    this.editItem('domains.blacklist', n, value);
                                }}/>
                            </div>
                        </div>
                    </Section>
                    <Section name="Word Blacklist" open={this.state.wordsVisible}
                             onClick={() => this.toggleSection('words')}>
                        <div className="row">
                            <div className="col-6">
                                <div className="subsection-header">Blocked Tokens</div>
                                <ListGroup data={this.props.data.blocked_tokens} addItem={() => {
                                    this.addItem('blocked_tokens')
                                }} removeItem={n => {
                                    this.removeItem('blocked_tokens', n)
                                }} editItem={(n, value) => {
                                    this.editItem('blocked_tokens', n, value);
                                }}/>
                            </div>
                            <div className="col-6">
                                <div className="subsection-header">Blocked Words</div>
                                <ListGroup data={this.props.data.blocked_words} addItem={() => {
                                    this.addItem('blocked_words')
                                }} removeItem={n => {
                                    this.removeItem('blocked_words', n)
                                }} editItem={(n, value) => {
                                    this.editItem('blocked_words', n, value);
                                }}/>
                            </div>
                        </div>
                    </Section>
                </div>
                <Switch
                    id="zalgo"
                    label="Censor Zalgo"
                    onChange={this.onZalgoChange}
                    checked={this.props.data.zalgo}
                    disabled={window.Panel.Server.readonly}
                />
            </div>
        );
    }
}