import _ from 'lodash';
import axios from 'axios';
import toastr from 'toastr';

export default class SettingsRepository {

    static getSetting(key: string, def: any | null = null): any {
        let result = _.find(window.Panel.Server.settings, {key: key});
        if (result === undefined || result == null) {
            return def;
        }
        return result['value'];
    }

    static setSetting(key: string, value: any, persist?: boolean) {
        let result = _.find(window.Panel.Server.settings, {key: key});
        if (result == null) {
            window.Panel.Server.settings.push({
                id: window.Panel.Server.id + '_' + key,
                guild: window.Panel.Server.id,
                key: key,
                value: value
            });
        } else {
            result.value = value;
        }

        if (persist) {
            axios.patch('/api/guild/' + window.Panel.Server.id + '/setting', {
                key: key,
                value: value
            }).catch(e => {
                if (e.response.status == 422) {
                    console.warn("Received 422 when attempting to save key " + key);
                    toastr.warning('Key ' + key + ' is not whitelisted for saving');
                }
            });
        }
    }
}