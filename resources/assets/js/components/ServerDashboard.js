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
                    id: ''
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
                    axios.delete('/dashboard/' + Server.id + '/command/' + id).then(resp=>{
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