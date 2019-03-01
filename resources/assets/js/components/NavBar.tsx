import React, {Component, ReactElement} from 'react';

interface NavBarLinkProps {
    href: string,
    title: string
}

function NavBarLink(props: NavBarLinkProps) {
    return (
        <li className="nav-item"><a className="nav-link" href={props.href}>{props.title}</a></li>
    )
}

interface NavBarDropdownState {
    id: string
}

interface NavBarDropdownProps {
    name: string
    direction?: 'left' | 'right'
}

class NavBarDropdown extends Component<NavBarDropdownProps, NavBarDropdownState> {
    constructor(props: any) {
        super(props);
        this.state = {
            id: 'navbar-dropdown-' + Math.random().toString(36).substr(7)
        }
    }

    dropdownClass(): string {
        let classes = "dropdown-menu";
        if (this.props.direction != null) {
            classes += ' dropdown-menu-' + this.props.direction
        }
        return classes
    }

    render() {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id={this.state.id} role="button" data-toggle="dropdown"
                   aria-haspopup={true} aria-expanded={false}>
                    {this.props.name}
                </a>
                <div className={this.dropdownClass()}>
                    {this.props.children}
                </div>
            </li>
        )
    }
}

function NavBarLeft(props: any) {
    return (
        <ul className="navbar-nav mr-auto">
            <NavBarLink href="/" title="Home"/>
            <NavBarLink href="/servers" title="Manage Servers"/>
        </ul>
    )
}

function NavBarRight(props: any) {
    let guest = window.user == null;
    let admin = window.user != null ? window.user.admin == 1 : false;
    let parts: any[] = [];
    if (guest) {
        return (<ul className="navbar-nav">
            <NavBarLink href="/login" title="Log In"/>
        </ul> )
    } else {
        if (admin) {
            parts.push(<a className="dropdown-item" href="/admin" key={"admin"}><i className="fa-btn"><i className="fas fa-cogs"/></i>Admin</a>);
            parts.push(<a className="dropdown-item" href="/admin/settings" key={"admin-setings"}><i className="fa-btn"><i
                className="fas fa-wrench"/></i>Settings</a>)

        }
        parts.push(<a className="dropdown-item" href="/logout" key={"logout"}><i className="fa-btn"><i
            className="fas fa-sign-out-alt"/></i>Log Out</a>)
    }
    return (
        <ul className="navbar-nav">
            <NavBarDropdown name={window.user == null ? 'Unknown' : window.user.username} direction="right">
                {parts}
            </NavBarDropdown>
        </ul>
    )
}

export default class NavBar extends Component {

    render() {
        return [<NavBarLeft key={"navbar-left"}/>, <NavBarRight key={"navbar-right"}/>];
    }
}