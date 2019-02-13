export default class SettingsRepository {

    static getSettings(key, def = null) {
        let result =  _.find(Server.settings, {key: key});
        if(result === undefined) {
            return def;
        }
        return result.value;
    }

    static setSettings(key, value) {
        Server.settings[key] = value;
        // TODO 2019-02-11: Persist this in the backend.
    }
}