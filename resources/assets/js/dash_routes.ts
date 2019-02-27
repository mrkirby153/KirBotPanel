import {RouteProps} from "react-router";

const routes: RouteProps[] = [
    {
        path: '/',
        exact: true,
        component: require('./components/dashboard/General').default
    },
    {
        path: '/permissions',
        component: require('./components/dashboard/Permissions').default
    }
];

export default routes;

