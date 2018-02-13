import Form from "../../form/form2";

Vue.component('settings-commands', {
    data() {
        return {
            forms: {
                cmdDiscriminator: new Form('patch', '/dashboard/'+Server.id+'/discriminator', {
                    discriminator: '!'
                }),
                editCommand: new Form("", "", {
                    name: '',
                    description: '',
                    clearance: '',
                    id: '',
                    respect_whitelist: true
                })
            },
            commands: [],
            addingCommand: false,
            toDelete: '',
            readonly: ReadOnly
        }
    },

    mounted() {
        if (Server != null) {
            this.forms.cmdDiscriminator.discriminator = Server.command_discriminator
        }
        if (Commands != null) {
            this.commands = Commands;
        }
    },

    methods: {
        localizeClearance(clearance) {
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

        editCommand(id, newCommand) {
            this.forms.editCommand.successful = false;
            this.forms.editCommand.busy = false;
            this.forms.editCommand.errors.clearAll();
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
                onApprove() {
                    if (newCommand) {
                        vm.forms.editCommand.put('/dashboard/'+Server.id+'/commands').then(()=>{
                            vm.refreshCommands();
                            setTimeout(()=>{
                                $("#edit-command-modal").modal('hide');
                            }, 1000)
                        }, ()=>{
                            // Rejected
                        });
                        return false;
                    } else {
                        vm.forms.editCommand.patch('/dashboard/'+Server.id+'/command/'+vm.forms.editCommand.id).then(()=>{
                            vm.refreshCommands();
                            setTimeout(()=>{
                                $("#edit-command-modal").modal('hide')
                            }, 1000)
                        }, ()=>{
                            // Rejected
                        });
                        return false
                    }
                },
                onHide() {
                    vm.forms.editCommand.name = "";
                    vm.forms.editCommand.clearance = "";
                    vm.forms.editCommand.description = "";
                    vm.forms.editCommand.id = "";
                }

            }).modal('show');
        },

        confirmDelete(id) {
            this.toDelete = id;
            let vm = this;
            $("#delete-command-modal").modal({
                closable: false,
                transition: 'scale',
                onApprove() {
                    axios.delete('/dashboard/' + Server.id + '/command/' + id).then(resp => {
                        vm.refreshCommands();
                    })
                }
            }).modal('show');
        },

        saveDiscrim() {
            this.forms.cmdDiscriminator.save();
        },

        refreshCommands() {
            axios.get('/dashboard/' + Server.id + '/commands').then(response => {
                this.commands = response.data;
            })
        }
    }
});