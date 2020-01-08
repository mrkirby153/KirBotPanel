import {ActionType} from "typesafe-actions";
import ld_filter from 'lodash/filter';

interface EventListener {
    key: string | string[]
    id: number;

    func(action: ActionType<any>): void
}

let eventListeners: EventListener[] = [];

let id = 0;

const listenerMiddleware = store => next => action => {
    setTimeout(() => {
        // Run listeners
        eventListeners.forEach(listener => {
            if (Array.isArray(listener.key) && listener.key.indexOf(action.type) != -1 || listener.key == action.type) {
                listener.func(action);
            }
        })
    });
    next(action);
};

export function addEventListener(key: string | string[], func: (action: ActionType<any>) => void): number {
    let listenerId = id++;
    eventListeners.push({key, func, id: listenerId});
    debugLog(`Adding event listener for ${key} (${listenerId})`, eventListeners);
    return listenerId;
}

export function removeEventListener(id: number) {
    eventListeners = ld_filter(eventListeners, listener => listener.id != id);
    debugLog(`Removing event listener with id ${id}`, eventListeners);
}

function debugLog(message: any, ...rest) {
    if (process.env.NODE_ENV == "development") {
        console.groupCollapsed(message);
        rest.forEach(arg => console.log(arg));
        console.groupEnd();
    }
}

export default listenerMiddleware;