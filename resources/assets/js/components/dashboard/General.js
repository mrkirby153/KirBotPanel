import Form from "../../form/form2";
import axios from 'axios';
import LogSettings from "../../logsettings";

Vue.component('settings-realname', {

    data() {
        return {
            forms: {
                realName: new Form('POST', '/dashboard/' + Server.id + '/realname', {
                    requireRealname: false,
                    realnameSetting: 'OFF'
                })
            },
            readonly: ReadOnly
        }
    },


    mounted() {
        if (Server != null) {
            this.forms.realName.requireRealname = Server.require_realname;
            this.forms.realName.realnameSetting = Server.realname;
        }
    },

    methods: {
        sendForm() {
            if (this.forms.realName.realnameSetting === "OFF") {
                this.forms.realName.requireRealname = false;
            }
            // Panel.post('/dashboard/' + Server.id + '/realname', this.forms.realName);
            this.forms.realName.save();
        }
    }
});

Vue.component('settings-logging', {

    data() {
        return {
            readonly: ReadOnly,
            settings: {},
            selectedChan: "",
            logOptions: LogSettings,
        }
    },

    computed: {
        channels() {
            return _.filter(Server.channels, chan => {
                if (chan.type !== "TEXT")
                    return false;
                return _.indexOf(_.map(this.settings, f => f.channel_id), chan.id) === -1;
            })
        },
    },

    methods: {
        onMount() {
            this.settings = Server.log_settings;
            this.settings.forEach(s => {
                s.events = this.splitEvents(s.events);
            });
            this.updateSettings = _.debounce(this.updateSettings, 500);
        },
        createSettings(chan) {
            axios.put('/dashboard/' + Server.id + '/logSetting', {
                channel: chan
            }).then(resp => {
                let obj = resp.data;
                obj.events = this.splitEvents(obj.events);
                this.settings.push(obj);
            })
        },
        deleteSettings(id) {
            axios.delete('/dashboard/' + Server.id + '/logSetting/' + id).then(resp => {
                this.settings = _.filter(this.settings, f => f.id !== id)
            })
        },
        updateSettings(id) {
            axios.patch('/dashboard/' + Server.id + '/logSetting/' + id, {
                events: this.settings[_.findIndex(this.settings, f => f.id === id)].events
            })
        },

        onChange() {
            this.createSettings(this.selectedChan);
            let vm = this;
            setTimeout(function () {
                vm.selectedChan = "";
            }, 20);
        },


        splitEvents(num) {
            let arr = [];
            Object.keys(LogSettings).forEach(k => {
                if ((num & LogSettings[k]) !== 0 && LogSettings[k] !== LogSettings.ALL_EVENTS) {
                    arr.push("" + LogSettings[k]);
                }
            });
            if (num === LogSettings.ALL_EVENTS) {
                return ["" + LogSettings.ALL_EVENTS]
            }
            return arr;
        }
    },

    mounted() {
        this.onMount();
    }
});

Vue.component('settings-channel-whitelist', {
    data() {
        return {
            forms: {
                whitelist: new Form('post', '/dashboard/' + Server.id + '/whitelist', {
                    channels: []
                })
            },
            readonly: ReadOnly
        }
    },

    mounted() {
        this.forms.whitelist.channels = (Server.cmd_whitelist == null) ? [] : Server.cmd_whitelist;
    },

    methods: {
        save() {
            this.forms.whitelist.save();
        }
    }
});

Vue.component('settings-bot-name', {
    data() {
        return {
            forms: {
                name: new Form('post', '/dashboard/' + Server.id + '/botName', {
                    name: ''
                })
            },
            readonly: ReadOnly
        }
    },

    mounted() {
        this.forms.name.name = Server.bot_nick;
    },
    methods: {
        save() {
            this.forms.name.save();
        }
    }
});

Vue.component('settings-user-persistence', {
    data() {
        return {
            forms: {
                persist: new Form('patch', '/dashboard/' + Server.id + '/persistence', {
                    persistence: false
                })
            },
            readonly: ReadOnly
        }
    },

    mounted() {
        this.forms.persist.persistence = Server.user_persistence;
    },

    methods: {
        save() {
            this.forms.persist.save();
        }
    }
});