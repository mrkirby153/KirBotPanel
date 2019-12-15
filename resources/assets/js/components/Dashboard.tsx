import React, {
    Component,
    ReactElement,
} from 'react';
import {
    Route,
    NavLink,
    BrowserRouter, Switch, RouteProps, NavLinkProps, withRouter
} from 'react-router-dom';
import tabs from './dashboard/tabs';
import ErrorBoundary from "./ErrorBoundary";
import configureStore from "./dashboard/store";
import {Provider, connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {getUser} from "./actionCreators";

function DashLink(props: NavLinkProps) {
    let p = Object.assign({}, props);
    p.to = '/dashboard/' + window.Panel.Server.id + props.to;
    return (<NavLink {...p}>{props.children}</NavLink>)
}


const actionCreators = dispatch => {
   return bindActionCreators({
       getUser
   }, dispatch);
};

export default class DashRouter extends Component {
    render() {
        const Dash = connect(null, actionCreators)(withRouter(props => <Dashboard {...props}/>));
        const store = configureStore(tabs);
        return (<BrowserRouter>
            <Provider store={store}>
                <Dash/>
            </Provider>
        </BrowserRouter>)
    }
}

interface DashboardProps extends RouteProps {
    getUser?: Function
}

class Dashboard extends Component<DashboardProps, {}> {

    static generateRoutes(): ReactElement[] {
        let routes: ReactElement[] = [];
        tabs.forEach(tab => {
            routes.push(<Route {...tab.route} key={tab.route.path as string}
                               path={'/dashboard/' + window.Panel.Server.id + tab.route.path}/>)
        });
        return routes;
    }

    static getDashLinks(): ReactElement[] {
        let dash_links: ReactElement[] = [];
        tabs.forEach(tab => {
            dash_links.push(<li className="nav-item" key={tab.name}>
                <DashLink to={tab.route.path as string} exact={tab.route.exact} className="nav-link text-left"><i
                    className={"fas fa-" + tab.icon + " menu-icon"}/>{tab.name}</DashLink>
            </li>)
        });
        return dash_links;
    }

    static getServerIcon(): string {
        if (window.Panel.Server.icon_id != null) {
            return 'https://cdn.discordapp.com/icons/' + window.Panel.Server.id + '/' + window.Panel.Server.icon_id + '.png';
        } else {
            return '/serverIcon?server_name=' + encodeURI(window.Panel.Server.name);
        }
    }

    componentDidMount(): void {
        if(this.props.getUser) {
            this.props.getUser();
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

            let matches = tabs.filter(tab => {
                let routePath = '/dashboard/' + window.Panel.Server.id + (tab.route.path as string);
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
            <ErrorBoundary>
                <div className="row mt-2">
                    <div className="col-lg-2 col-md-12">
                        <div className="mb-3 pb-2 card">
                            <div className="card-header">
                                {window.Panel.Server.name}
                            </div>
                            <div className="card-body d-flex flex-column">
                                <img className="m-auto server-image" src={Dashboard.getServerIcon()}
                                     alt={window.Panel.Server.name}/>
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
            </ErrorBoundary>
        );
    }
}