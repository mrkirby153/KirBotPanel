import _ from 'lodash';

export default class SettingsRepository {

    static getSetting(key: string, def: any | null = null): any {
        let result = _.find(window.Panel.Server.settings, {key: key});
        if (result === undefined || result == null) {
            return def;
        }
        return result['value'];
    }

    static setSetting(key: string, value: any) {
        let result = _.find(window.Panel.Server.settings, {key: key});
        if (result == null) {
            window.Panel.Server.settings.push({
                id: window.Panel.Server.id + '_' + key,
                guild: window.Panel.Server.id,
                key: key,
                value: value
            });
            return;
        }
        result.value = value;
    }
}