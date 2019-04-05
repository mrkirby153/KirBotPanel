import {RouteProps} from "react-router";

interface Route extends RouteProps {
    name: string
}

const routes: Route[] = [
    {
        path: '/',
        exact: true,
        component: require('./components/dashboard/General').default,
        name: 'General'
    },
    {
        path: '/permissions',
        component: require('./components/dashboard/Permissions').default,
        name: 'Permissions'
    },
    {
        path: '/commands',
        component: require('./components/dashboard/Commands').default,
        name: 'Custom Commands'
    }
];

export default routes;

