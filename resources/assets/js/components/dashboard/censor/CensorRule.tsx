import React from 'react';
import Collapse from "../../Collapse";
import Switch from "../../Switch";
import {DashboardInput} from "../../DashboardInput";

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
    }
}

interface CensorRuleState {
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
    for (let i = 0; i < props.data.length; i++) {
        components.push(<div className="row" key={props.data[i]}>
            <div className="col-6 mb-2">
                <div className="input-group">
                    <DashboardInput type="text" value={props.data[i]} className="form-control"
                                    onChange={e => onChange(i, e)}/>
                    <div className="input-group-append">
                        <span className="input-group-text"><i className="fas fa-times remove-button"
                                                              onClick={() => props.removeItem(i)}/></span>
                    </div>
                </div>
            </div>
        </div>)
    }
    return (
        <div className="container-fluid">
            {components}
            <button className="btn btn-success" onClick={props.addItem}>Add</button>
        </div>);
};

export default class CensorRule extends React.Component<CensorRuleProps, CensorRuleState> {
    constructor(props) {
        super(props);
        this.state = {
            domainsVisible: false,
            invitesVisible: false,
            wordsVisible: false,
        }
    }

    toggleSection = (section) => {
        let sectionName = `${section}Visible`;
        let prev = this.state[sectionName];
        // @ts-ignore
        this.setState({
            [sectionName]: !prev
        })
    };

    mkInviteWhitelist = () => {
        let invites = this.props.data.invites.guild_whitelist;

        let components: React.ReactElement[] = [];
        for (let i = 0; i < invites.length; i++) {
            components.push(

            );
        }
        return components;
    };

    render() {
        return (
            <div className="censor-rule">
                <span className="level">{this.props.level}</span>
                <Section name="Invites" open={this.state.invitesVisible}
                         onClick={() => this.toggleSection('invites')}>
                    <Switch id="invites-enabled" label="Enabled" switchSize="small"/>
                    <div className="row">
                        <div className="col-6">
                            <div className="subsection-header">Guild Whitelist</div>
                            <div className="container-fluid">
                                <ListGroup data={this.props.data.invites.guild_whitelist} addItem={() => {
                                }} removeItem={() => {
                                }} editItem={() => {
                                }}/>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="subsection-header">Guild Blacklist</div>
                            <div className="container-fluid">
                                <ListGroup data={this.props.data.invites.guild_blacklist} addItem={() => {
                                }} removeItem={() => {
                                }} editItem={() => {
                                }}/>
                            </div>
                        </div>
                    </div>
                </Section>
                <Section name="Domains" open={this.state.domainsVisible}
                         onClick={() => this.toggleSection('domains')}>
                    <Switch id="domains-enabled" label="Enabled" switchSize="small"/>
                    <div className="row">
                        <div className="col-6">
                            <div className="subsection-header">Domain Whitelist</div>
                            <ListGroup data={this.props.data.domains.whitelist} addItem={() => {
                            }} removeItem={() => {
                            }} editItem={() => {
                            }}/>
                        </div>
                        <div className="col-6">
                            <div className="subsection-header">Domain Blacklist</div>
                            <ListGroup data={this.props.data.domains.blacklist} addItem={() => {
                            }} removeItem={() => {
                            }} editItem={() => {
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
                            }} removeItem={() => {
                            }} editItem={() => {
                            }}/>
                        </div>
                        <div className="col-6">
                            <div className="subsection-header">Blocked Words</div>
                            <ListGroup data={this.props.data.blocked_words} addItem={() => {
                            }} removeItem={() => {
                            }} editItem={() => {
                            }}/>
                        </div>
                    </div>
                </Section>
                <Switch id="zalgo" label="Censor Zalgo"/>
            </div>
        );
    }
}