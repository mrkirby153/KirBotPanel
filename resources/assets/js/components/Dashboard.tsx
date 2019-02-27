import React, {
    Component,
    ReactElement,
} from 'react';
import {
    Route,
    NavLink,
    BrowserRouter, Switch, RouteProps, NavLinkProps, LinkProps
} from 'react-router-dom';
import declared_routes from '../dash_routes';

function DashLink(props: NavLinkProps) {
    let p = Object.assign({}, props);
    p.to = '/dashboard/' + window.Server.id + props.to;
    return (<NavLink {...p}>{props.children}</NavLink>)
}

export default class Dashboard extends Component {

    static generateRoutes(): ReactElement[] {
        let routes: ReactElement[] = [];
        declared_routes.forEach(route => {
            let props: RouteProps = Object.assign({}, route);
            props.path = '/dashboard/' + window.Server.id + props.path;
            routes.push(<Route {...props}/>)
        });
        return routes;
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <h1>SPA</h1>
                    <ul className="header">
                        <li><DashLink to={"/"} exact={true}>Home</DashLink></li>
                        <li><DashLink to={"/permissions"}>Permissions</DashLink></li>
                    </ul>

                    <div className="content">
                        <Switch>
                            {Dashboard.generateRoutes()}
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}