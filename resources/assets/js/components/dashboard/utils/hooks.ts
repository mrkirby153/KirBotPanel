import {useDispatch, useSelector} from 'react-redux';
import {setSetting} from "../actions";

export function useGuildSetting<T>(guild: string, key: string, defaultValue: T): [T, ((value: T, persist: boolean) => void)] {
    const dispatch = useDispatch();
    const storeValue: T = useSelector(state => state.app.settings[key]);

    function set(value: T, persist: boolean = false) {
        dispatch(setSetting(guild, key, value == defaultValue ? null : value, persist))
    }

    if (storeValue == null) {
        return [defaultValue, set]
    } else {
        return [storeValue, set];
    }
}