import {RouteProps} from 'react-router';
// Import pages
import general from './General';
import permissions from './Permissions';
import commands from './Commands';
import music from './Music';
import infractions from './Infractions';
import spam from './Spam';
import censor from './Censor';
import antiraid from './AntiRaid';

export interface Tab {
    key: string,
    name: string,
    icon: string,
    route: RouteProps,
    reducer?: object,
}

const tabs: Tab[] = [
    general,
    permissions,
    commands,
    music,
    infractions,
    spam,
    censor,
    antiraid
];

export default tabs;