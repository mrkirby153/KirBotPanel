Vue.component('settings-realname', {

    data(){
        return {
            forms: {
                realName: $.extend(true, new Form({
                    requireRealname: false,
                    realnameSetting: 'OFF',
                }), {})
            }
        }
    },


    mounted(){
        if (ServerData != null) {
            this.forms.realName.requireRealname = ServerData.require_realname;
            this.forms.realName.realnameSetting = ServerData.realname;
        }
    },

    methods: {
        sendForm(){
            if (this.forms.realName.realnameSetting === "OFF") {
                this.forms.realName.requireRealname = false;
            }
            Panel.post('/dashboard/' + Server.id + '/realname', this.forms.realName);
        }
    }
});

Vue.component('settings-commands', {
    data(){
        return {
            forms: {
                cmdDiscriminator: $.extend(true, new Form({
                    discriminator: '!'
                }), {}),
                editCommand: $.extend(true, new Form({
                    name: '',
                    description: '',
                    clearance: '',
                    id: '',
                    respect_whitelist: true
                }), {})
            },
            commands: [],
            addingCommand: false,
            toDelete: ''
        }
    },

    mounted(){
        if (ServerData != null) {
            this.forms.cmdDiscriminator.discriminator = ServerData.command_discriminator
        }
        if (Commands != null) {
            this.commands = Commands;
        }
    },

    methods: {
        localizeClearance(clearance){
            switch (clearance) {
                case "BOT_OWNER":
                    return "Bot Owner";
                case "SERVER_OWNER":
                    return "Server Owner";
                case "SERVER_ADMINISTRATOR":
                    return "Server Administrator";
                case "BOT_MANAGER":
                    return "Bot Manager";
                case "USER":
                    return "User";
                case "BOT":
                    return "Bot";
            }
        },

        editCommand(id, newCommand){
            this.forms.editCommand.successful = false;
            this.forms.editCommand.busy = false;
            this.forms.editCommand.errors.forget();
            this.addingCommand = newCommand;
            if (!newCommand) {
                this.commands.forEach(c => {
                    if (c.id === id) {
                        this.forms.editCommand.name = c.name;
                        this.forms.editCommand.clearance = c.clearance;
                        this.forms.editCommand.description = c.data;
                        this.forms.editCommand.id = c.id;
                        this.forms.editCommand.respect_whitelist = c.respect_whitelist === 1;
                    }
                });
            }
            let vm = this;
            $("#edit-command-modal").modal({
                closable: false,
                transition: 'scale',
                onApprove(){
                    if (newCommand) {
                        Panel.put('/dashboard/' + Server.id + '/commands', vm.forms.editCommand).then(() => {
                            // fufilled
                            vm.refreshCommands();
                            setTimeout(() => {
                                $("#edit-command-modal").modal('hide');
                            }, 1000)
                        }, () => {
                            // rejected
                        });
                        return false;
                    } else {
                        Panel.sendForm('patch', '/dashboard/' + Server.id + '/commands', vm.forms.editCommand).then(() => {
                            // fufilled
                            vm.refreshCommands();
                            setTimeout(() => {
                                $("#edit-command-modal").modal('hide');
                            }, 1000)
                        }, () => {
                            // rejected
                        });
                        return false
                    }
                },
                onHide(){
                    vm.forms.editCommand.name = "";
                    vm.forms.editCommand.clearance = "";
                    vm.forms.editCommand.description = "";
                    vm.forms.editCommand.id = "";
                }

            }).modal('show');
        },

        confirmDelete(id){
            this.toDelete = id;
            let vm = this;
            $("#delete-command-modal").modal({
                closable: false,
                transition: 'scale',
                onApprove(){
                    axios.delete('/dashboard/' + Server.id + '/command/' + id).then(resp => {
                        vm.refreshCommands();
                    })
                }
            }).modal('show');
        },

        saveDiscrim(){
            Panel.sendForm('patch', '/dashboard/' + Server.id + '/discriminator', this.forms.cmdDiscriminator);
        },

        refreshCommands(){
            axios.get('/dashboard/' + Server.id + '/commands').then(response => {
                this.commands = response.data;
            })
        }
    }
});

Vue.component('settings-logging', {
    data(){
        return {
            forms: {
                logging: $.extend(true, new Form({
                    enabled: false,
                    channel: ''
                }), {})
            },
            loaded: false
        }
    },

    beforeMount(){
        this.forms.logging.enabled = ServerData.log_channel !== null;
        this.forms.logging.channel = ServerData.log_channel !== null ? ServerData.log_channel : null;
    },

    methods: {
        save(){
            if (!this.forms.logging.enabled) {
                this.forms.logging.channel = null
            }
            Panel.sendForm('patch', '/dashboard/' + Server.id + '/logging', this.forms.logging);
        }
    }
});

Vue.component('settings-music', {
    data(){
        return {
            forms: {
                music: $.extend(true, new Form({
                    enabled: true,
                    whitelist_mode: 'OFF',
                    channels: [],
                    blacklisted_urls: '',
                    max_queue_length: -1,
                    max_song_length: -1,
                    skip_cooldown: 0,
                    skip_timer: 30,
                    playlists: false,
                }), {})
            }
        }
    },

    mounted(){
        this.forms.music.enabled = Music.enabled;
        this.forms.music.whitelist_mode = Music.mode;
        this.forms.music.blacklisted_urls = Music.blacklist_songs.replace(new RegExp(',', 'g'), "\n");
        if (Music.mode !== 'OFF')
            this.forms.music.channels = Music.channels.split(",");

        this.forms.music.max_queue_length = Music.max_queue_length;
        this.forms.music.max_song_length = Music.max_song_length;
        this.forms.music.skip_cooldown = Music.skip_cooldown;
        this.forms.music.skip_timer = Music.skip_timer;
        this.forms.music.playlists = Music.playlists;
    },

    methods: {
        sendForm(){
            Panel.post('/dashboard/' + Server.id + '/music', this.forms.music)
        },
        capitalizeFirstLetter(string) {
            string = string.toLowerCase();
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
});
Vue.component('settings-channels', {
    data(){
        return {
            channels: []
        }
    },

    mounted(){
        this.channels = Channels;
    },

    computed: {
        textChannels(){
            return _.reject(this.channels, chan => chan.type === "VOICE")
        },
        voiceChannels(){
            return _.reject(this.channels, chan => chan.type === "TEXT")
        }
    },

    methods: {
        channelVisibility(channel, visibility){
            let chan = this.textChannels[channel];
            axios.post('/dashboard/' + ServerId + '/channels/' + chan.id + '/visibility', {
                visible: visibility
            }).then(() => {
                this.channels[_.indexOf(this.channels, chan)].private = !visibility
            })
        },
        regainAccess(channel){
            let chan = this.textChannels[channel];
            axios.post('/dashboard/' + ServerId + '/channels/' + chan.id + '/access')
        }
    }
});

Vue.component('settings-channel-whitelist', {
    data(){
        return {
            forms: {
                whitelist: $.extend(true, new Form({
                    channels: []
                }), {})
            }
        }
    },

    mounted(){
        this.forms.whitelist.channels = ServerData.cmd_whitelist.split(",")
    },

    methods: {
        save(){
            Panel.sendForm('post', '/dashboard/'+Server.id+'/whitelist', this.forms.whitelist)
        }
    }
});