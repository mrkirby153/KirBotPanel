import {useDispatch, useSelector} from 'react-redux';
import {setSetting} from "../actions";

export function useGuildSetting<T>(guild: string, key: string, defaultValue: T, autoPersist: boolean = false): [T, ((value: T) => void), () => void] {
    const dispatch = useDispatch();
    const storeValue: T = useSelector(state => state.app.settings[key]);

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