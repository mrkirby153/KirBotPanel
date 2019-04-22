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
    },
    {
        path: '/music',
        component: require('./components/dashboard/Music').default,
        name: 'Music'
    },
    {
        path: '/infractions',
        component: require('./components/dashboard/Infractions').default,
        name: 'Infractions'
    },
    {
        path: '/spam',
        component: require('./components/dashboard/Spam').default,
        name: 'Spam'
    },
    {
        path: '/raid',
        component: require('./components/Dashboard/AntiRaid').default,
        name: 'Anti-Raid'
    }
];

export default routes;

