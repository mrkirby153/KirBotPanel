import Form from "../../form/form2";
import axios from 'axios';

Vue.component('settings-realname', {

    data() {
        return {
            forms: {
                realName: new Form('POST', '/dashboard/' + Server.id + '/realname', {
                    requireRealname: Server.require_realname,
                    realnameSetting: Server.realname
                })
            },
            readonly: App.readonly
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
            readonly: App.readonly,
            settings: {},
            selectedChan: "",
            logOptions: LogEvents,
            confirming: [],
            communicationError: false,
            editing: {
                chan: null,
                name: '',
                mode: 'include',
                include: {},
                exclude: {}
            }
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
            if (Object.keys(this.logOptions).length === 0) {
                this.readonly = true;
                this.communicationError = true;
            }
            let vm = this;
            this.editing.include = this.cleanLogEvents();
            this.editing.exclude = this.cleanLogEvents();
            $("#logSettingModal").on('hide.bs.modal', e => {
                vm.editing = {
                    chan: null,
                    name: '',
                    mode: 'include',
                    include: this.cleanLogEvents(),
                    exclude: this.cleanLogEvents()
                };
            })
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
            let setting = _.find(this.settings, ['id', id]);
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
        },
        localizeEvents(split, defaultMsg = "All Events") {
            let str = "";
            let exists = false;
            split.forEach(e => {
                Object.keys(LogEvents).forEach(k => {
                    if (LogEvents[k] == e) {
                        str += k + ", ";
                        exists = true;
                    }
                })
            });
            if (exists) {
                str = str.substring(0, str.lastIndexOf(","));
            }
            if (str === "") {
                str = defaultMsg;
            }
            return str;
        },

        confirmDelete(id) {
            if (this.isConfirming(id)) {
                this.confirming = _.without(this.confirming, id);
                this.deleteSettings(id);
            } else {
                this.confirming.push(id);
                setTimeout(() => {
                    this.confirming = _.without(this.confirming, id);
                }, 5000);
            }
        },

        isConfirming(id) {
            return _.indexOf(this.confirming, id) !== -1
        },

        showEditModal(id) {
            let el = null;
            this.settings.forEach(e => {
                if (e.id === id) {
                    el = e;
                }
            });
            this.editing.chan = id;
            this.editing.name = el.channel.channel_name;

            Object.keys(LogEvents).forEach(option => {
                this.editing.include[option] = _.indexOf(el.included, "" + LogEvents[option]) !== -1;
                this.editing.exclude[option] = _.indexOf(el.excluded, "" + LogEvents[option]) !== -1;
            });
            $("#logSettingModal").modal('show');
        },

        transformEditSettings(obj) {
            let arr = [];
            Object.keys(LogEvents).forEach(option => {
                if (obj[option]) {
                    arr.push(LogEvents[option] + "");
                }
            });
            return arr;
        },

        saveEditSettings() {
            let obj = _.find(this.settings, ['id', this.editing.chan]);
            obj.included = this.transformEditSettings(this.editing.include);
            obj.excluded = this.transformEditSettings(this.editing.exclude);
            // commit to the db
            this.updateSettings(obj.id);
            $("#logSettingModal").modal('hide');
        },

        cleanLogEvents() {
            let el = {};
            Object.keys(LogEvents).forEach(option => {
                el[option] = false;
            });
            return el;
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
            chanAdd: "",
            readonly: App.readonly
        }
    },

    mounted() {
        this.forms.whitelist.channels = (Server.cmd_whitelist == null) ? [] : Server.cmd_whitelist;
    },

    computed: {
        channels() {
            let arr = [];
            this.forms.whitelist.channels.forEach(id => {
                arr.push(_.first(_.filter(Server.channels, c => {
                    return c.id === id
                })))
            });
            return arr;
        },
        availableChannels(){
            let arr = [];
            Server.channels.forEach(c => {
                if(!_.find(this.channels, ['id', c.id]) && c.type === "TEXT")
                    arr.push(c);
            });
            return arr;
        }
    },

    methods: {
        save() {
            this.forms.whitelist.save();
        },

        addChannel() {
            this.forms.whitelist.channels.push(this.chanAdd);
            this.chanAdd = "";
            this.save()
        },
        removeChannel(id) {
            this.forms.whitelist.channels = _.without(this.forms.whitelist.channels, id);
            this.save()
        }
    }
});

Vue.component('settings-bot-name', {
    data() {
        return {
            forms: {
                name: new Form('post', '/dashboard/' + Server.id + '/botName', {
                    name: Server.bot_nick
                })
            },
            readonly: false
        }
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
                    persistence: Server.user_persistence
                })
            },
            readonly: App.readonly
        }
    },

    methods: {
        save() {
            this.forms.persist.save();
        }
    }
});