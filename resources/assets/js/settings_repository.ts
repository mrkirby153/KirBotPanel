import _ from 'lodash';

export default class SettingsRepository {

    static getSetting(key: string, def: any | null = null): any {
        let result = _.find(window.Panel.Server.settings, {key: key});
        if (result === undefined || result == null) {
            return def;
        }
        return result['value'];
    }
}