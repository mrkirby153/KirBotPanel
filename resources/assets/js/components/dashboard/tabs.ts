import {RouteProps} from 'react-router';
// Import pages
import general from './general/General';
import permissions from './permissions/Permissions';
import commands from './commands/Commands';
import music from './music/Music';
import infractions from './infractions/Infractions';
import spam from './spam/Spam';
import censor from './censor/Censor';
import antiraid from './raid/AntiRaid';

export interface Tab {
    key: string,
    name: string,
    icon: string,
    route: RouteProps,
    reducer?: object,
    saga?: any
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