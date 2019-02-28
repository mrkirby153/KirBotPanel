import React, {
    Component,
    ReactElement,
} from 'react';
import {
    Route,
    NavLink,
    BrowserRouter, Switch, RouteProps, NavLinkProps, withRouter
} from 'react-router-dom';
import declared_routes from '../dash_routes';

function DashLink(props: NavLinkProps) {
    let p = Object.assign({}, props);
    p.to = '/dashboard/' + window.Server.id + props.to;
    return (<NavLink {...p}>{props.children}</NavLink>)
}

interface DashLinkProps {
    name: string,
    icon: string,
    route: string,
    exact?: boolean
}

const links: DashLinkProps[] = [
    {
        name: 'General',
        icon: 'cog',
        route: '/',
        exact: true
    },
    {
        name: 'Permissions',
        icon: 'user-shield',
        route: '/permissions'
    }
];


export default class DashRouter extends Component {
    render() {
        const Dash = withRouter(props => <Dashboard {...props}/>);
        return (<BrowserRouter>
            <Dash/>
        </BrowserRouter>)
    }
}

class Dashboard extends Component<RouteProps, {}> {

    static generateRoutes(): ReactElement[] {
        let routes: ReactElement[] = [];
        declared_routes.forEach(route => {
            routes.push(<Route {...route} key={route.path as string} path={'/dashboard/' + window.Server.id + route.path}/>)
        });
        return routes;
    }

    static getDashLinks(): ReactElement[] {
        let dash_links: ReactElement[] = [];
        links.forEach(link => {
            dash_links.push(<li className="nav-item"key={link.name} >
                <DashLink to={link.route} exact={link.exact} className="nav-link text-left"><i
                    className={"fas fa-" + link.icon + " menu-icon"}/>{link.name}</DashLink>
            </li>)
        });
        return dash_links;
    }

    static getServerIcon(): string {
        if (window.Server.icon_id != null) {
            return 'https://cdn.discordapp.com/icons/' + window.Server.id + '/' + window.Server.icon_id + '.png';
        } else {
            return '/serverIcon?server_name=' + encodeURI(window.Server.name);
        }
    }

    getRouteName(): string {
        let location = this.props.location;
        if (location) {
            let pathName = location.pathname;
            // Remove the trailing /
            if (pathName.endsWith("/")) {
                pathName = pathName.substr(0, pathName.length - 1);
            }

            let matches = declared_routes.filter(route => {
                let routePath = '/dashboard/' + window.Server.id + (route.path as string);
                if (routePath.endsWith("/")) {
                    routePath = routePath.substr(0, routePath.length - 1);
                }
                return pathName == routePath
            });

            if (matches.length > 0) {
                return matches[0].name
            }
        }
        return "???";
    }

    render() {
        return (
            <div className="row mt-2">
                <div className="col-lg-2 col-md-2">
                    <div className="mb-3 pb-2 card">
                        <div className="card-header">
                            {window.Server.name}
                        </div>
                        <div className="card-body d-flex flex-column">
                            <img className="m-auto server-image" src={Dashboard.getServerIcon()} alt={window.Server.name}/>
                            <ul className="nav nav-pills nav-fill flex-column mt-3 dashboard-sidebar">
                                {Dashboard.getDashLinks()}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-lg-10 col-md-12 pb-sm-2">
                    <div className="card">
                        <div className="card-header">
                            {this.getRouteName()}
                        </div>
                        <div className="card-body">
                            <Switch>
                                {Dashboard.generateRoutes()}
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}