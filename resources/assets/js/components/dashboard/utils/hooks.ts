import {useDispatch} from 'react-redux';
import {setSetting} from "../actions";
import {ActionType} from "typesafe-actions";
import {useEffect} from "react";
import {addEventListener, removeEventListener} from "../reducerListener";
import {useTypedSelector} from "../reducers";

export function useGuildSetting<T>(guild: string, key: string, defaultValue: T, autoPersist: boolean = false): [T, ((value: T) => void), () => void] {
    const dispatch = useDispatch();
    const storeValue: T = useTypedSelector(state => state.app.settings[key]);

    function set(value: T, persist: boolean = autoPersist) {
        dispatch(setSetting(guild, key, value == defaultValue ? null : value, persist))
    }

    function save() {
        dispatch(set(storeValue, true))
    }

    if (storeValue == null) {
        return [defaultValue, set, save]
    } else {
        return [storeValue, set, save];
    }
}

export function useReduxListener<T>(key: string | string[], func: (action: ActionType<T>) => void) {
    useEffect(() => {
        let id = addEventListener(key, func);
        return function () {
            removeEventListener(id);
        }
    }, []);
}