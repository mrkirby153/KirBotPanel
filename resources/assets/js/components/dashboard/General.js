import Form from "../../form/form2";
import axios from 'axios';

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
            logOptions: LogEvents,
            communicationError: false
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
                s.included = this.splitEvents(s.included);
                s.excluded = this.splitEvents(s.excluded);
            });
            this.updateSettings = _.debounce(this.updateSettings, 250);
            if (Object.keys(this.logOptions).length === 0) {
                this.readonly = true;
                this.communicationError = true;
            }
        },
        createSettings(chan) {
            axios.put('/dashboard/' + Server.id + '/logSetting', {
                channel: chan
            }).then(resp => {
                let obj = resp.data;
                obj.included = this.splitEvents(obj.included);
                obj.excluded = this.splitEvents(obj.excluded);
                this.settings.push(obj);
                this.selectedChan = "";
            })
        },
        deleteSettings(id) {
            if (this.readonly)
                return;
            // Delete the setting on the client before the server
            this.settings = _.filter(this.settings, f => f.id !== id);
            axios.delete('/dashboard/' + Server.id + '/logSetting/' + id)
        },
        updateSettings(id) {
            let setting = this.settings[_.findIndex(this.settings, f => f.id === id)];
            axios.patch('/dashboard/' + Server.id + '/logSetting/' + id, {
                included: setting.included,
                excluded: setting.excluded
            })
        },

        onChange() {
            this.createSettings(this.selectedChan);
        },


        splitEvents(num) {
            let arr = [];
            Object.keys(LogEvents).forEach(k => {
                if ((num & LogEvents[k]) !== 0) {
                    arr.push("" + LogEvents[k]);
                }
            });
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