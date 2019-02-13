import Vue from 'vue';
import Form from '../../form/form2'
import SettingsRepository from "../../settings";

Vue.component('settings-anti-raid', {

    data() {
        return {
            form: new Form('patch', '/dashboard/' + Server.id + '/anti-raid', {
                enabled: SettingsRepository.getSettings("anti_raid_enabled"),
                count: SettingsRepository.getSettings("anti_raid_count"),
                period: SettingsRepository.getSettings("anti_raid_period"),
                action: SettingsRepository.getSettings("anti_raid_action"),
                quiet_period: SettingsRepository.getSettings("anti_raid_quiet_period"),
                alert_role: SettingsRepository.getSettings("anti_raid_alert_role"),
                alert_channel: SettingsRepository.getSettings("anti_raid_alert_channel")
            }),
            ra: App.readonly
        }
    },

    computed: {
        readonly() {
            return App.readonly || !this.form.enabled
        }
    },

    methods: {
        save() {
            this.form.save();
        }
    }
});