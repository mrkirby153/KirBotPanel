import Form from "../../form/form2";

Vue.component('settings-realname', {

    data() {
        return {
            forms: {
                realName: new Form('POST', '/dashboard/'+Server.id+'/realname', {
                    requireRealname: false,
                    realnameSetting: 'OFF'
                })
            }
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
                logging: new Form('patch', '/dashboard/'+Server.id+'/logging', {
                    enabled: false,
                    channel: ''
                })
            },
            loaded: false
        }
    },

    beforeMount() {
        this.forms.logging.enabled = Server.log_channel !== null;
        this.forms.logging.channel = Server.log_channel !== null ? Server.log_channel : null;
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
                whitelist: new Form('post', '/dashboard/'+Server.id+'/whitelist', {
                    channels: []
                })
            }
        }
    },

    mounted() {
        this.forms.whitelist.channels = (Server.cmd_whitelist == null)? [] : Server.cmd_whitelist;
    },

    methods: {
        save() {
            this.forms.whitelist.save();
        }
    }
});

Vue.component('settings-bot-manager', {
    data() {
        return {
            forms: {
                roles: new Form('post', '/dashboard/'+Server.id+'/managers',{
                    roles:[]
                })
            }
        }
    },

    mounted() {
        this.forms.roles.roles = (Server.bot_manager == null)? [] : Server.bot_manager;
    },

    methods: {
        save() {
            this.forms.roles.save();
        }
    }
});