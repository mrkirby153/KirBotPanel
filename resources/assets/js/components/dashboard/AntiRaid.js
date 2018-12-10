import Vue from 'vue';
import Form from '../../form/form2'

Vue.component('settings-anti-raid', {

    data() {
        return {
            form: new Form('patch', '/dashboard/' + Server.id + '/anti-raid', {
                enabled: RaidSettings.enabled,
                count: RaidSettings.count,
                period: RaidSettings.period,
                action: RaidSettings.action,
                quiet_period: RaidSettings.quiet_period,
                alert_role: RaidSettings.alert_role,
                alert_channel: RaidSettings.alert_channel
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