import Form from "../../form/form2";

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
            forms: {
                logging: new Form('patch', '/dashboard/' + Server.id + '/logging', {
                    enabled: Server.log_channel !== null,
                    channel: Server.log_channel,
                    timezone: Server.log_timezone
                })
            },
            loaded: false,
            readonly: ReadOnly
        }
    },

    methods: {
        save() {
            if (!this.forms.logging.enabled) {
                this.forms.logging.channel = null
            }
            this.forms.logging.save();
        }
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