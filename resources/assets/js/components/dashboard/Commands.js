import Form from "../../form/form2";

Vue.component('settings-commands', {
    data() {
        return {
            forms: {
                cmdDiscriminator: new Form('patch', '/dashboard/' + Server.id + '/discriminator', {
                    discriminator: Server.command_discriminator
                }),
                editCommand: new Form("", "", {
                    name: '',
                    description: '',
                    clearance: '',
                    id: '',
                    respect_whitelist: true
                })
            },
            commands: Commands,
            addingCommand: false,
            toDelete: '',
            readonly: ReadOnly
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

        getCommand(id) {
            return _.find(this.commands, {
                id: id
            })
        },

        newCommand() {
            let vm = this;
            this.addingCommand = true;
            $("#edit-command-modal").modal({
                closable: false,
                transition: 'scale',
                onApprove() {
                    vm.forms.editCommand.put('/dashboard/' + Server.id + '/commands').then(resp => {
                        vm.commands.push(resp.data);
                        setTimeout(() => {
                            $("#edit-command-modal").modal('hide')
                        }, 1000)
                    }, () => {
                        // Rejected
                    });
                    return false
                },
                onHide() {
                    vm.forms.editCommand.name = "";
                    vm.forms.editCommand.clearance = "";
                    vm.forms.editCommand.description = "";
                    vm.forms.editCommand.id = "";
                }
            }).modal('show');
        },

        editCommand(id) {
            let c = this.getCommand(id);
            if (c === undefined) {
                console.log("Command " + id + " not found. Ignoring edit request");
                return;
            } else {
                console.log(c);
            }

            this.forms.editCommand.successful = false;
            this.forms.editCommand.busy = false;
            this.forms.editCommand.errors.clearAll();
            this.addingCommand = true;

            this.forms.editCommand.name = c.name;
            this.forms.editCommand.clearance = c.clearance_level;
            this.forms.editCommand.description = c.data;
            this.forms.editCommand.id = c.id;
            this.forms.editCommand.respect_whitelist = c.respect_whitelist;
            let vm = this;
            $("#edit-command-modal").modal({
                closable: false,
                transition: 'scale',
                onApprove() {
                    vm.forms.editCommand.patch('/dashboard/' + Server.id + '/command/' + vm.forms.editCommand.id).then(resp => {
                        let index = _.findIndex(vm.commands, {
                            id: id
                        });
                        if (index === -1) {
                            console.log("Command not found, refreshing all of them");
                            vm.refreshCommands();
                        } else {
                            vm.commands[index] = resp.data;
                        }
                        setTimeout(() => {
                            $("#edit-command-modal").modal('hide')
                        }, 1000)
                    }, () => {
                        // Rejected
                    });
                    return false
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
                        vm.commands = _.without(vm.commands, _.find(vm.commands, {
                            id: id
                        }))
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

Vue.component('settings-command-aliases', {
    data() {
        return {
            forms: {
                createAlias: new Form('PUT', '/dashboard/' + Server.id + '/commands/alias', {
                    command: "",
                    alias: null,
                    clearance: -1
                })
            },
            aliases: CommandAliases,
            readonly: ReadOnly,
            adding: false
        }
    },

    mounted() {
        this.onMount()
    },

    methods: {
        onMount() {

        },
        cancelAdd() {
            this.forms.createAlias.command = "";
            this.forms.createAlias.alias = null;
            this.forms.createAlias.clearance = -1;
            this.adding = false;
        },
        addAlias() {
            this.forms.createAlias.save().then(resp => {
                this.aliases.push(resp.data);
                this.cancelAdd();
            }).catch(err => {
                console.log(err);
            });
        },
        removeAlias(id) {
            axios.delete('/dashboard/' + Server.id + '/commands/alias/' + id).then(resp => {
                this.aliases = resp.data
            })
        }
    },
    computed: {
        command_discriminator() {
            return Server.command_discriminator;
        }
    }
});