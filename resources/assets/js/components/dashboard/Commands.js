import Form from "../../form/form2";
import axios from 'axios';
import SettingsRepository from "../../settings";

Vue.component('settings-commands', {
    data() {
        return {
            forms: {
                cmdDiscriminator: new Form('patch', '/dashboard/' + Server.id + '/discriminator', {
                    discriminator: SettingsRepository.getSettings("command_discriminator")
                }),
                silentFail: new Form('patch', '/dashboard/'+Server.id+'/commandFail', {
                    silent: SettingsRepository.getSettings("cmd_silent_fail")
                }),
                editCommand: new Form("", "", {
                    name: '',
                    description: '',
                    clearance: 0,
                    id: '',
                    respect_whitelist: true
                })
            },
            commands: Commands,
            addingCommand: false,
            toDelete: '',
            readonly: App.readonly,
            confirming: []
        }
    },

    mounted() {
        let vm = this;
        $("#commandModal").on('hide.bs.modal', () => {
            vm.resetEditForm();
        })
    },

    methods: {

        getCommand(id) {
            return _.find(this.commands, {
                id: id
            })
        },

        deleteCommand(id) {
            if (_.indexOf(this.confirming, id) !== -1) {
                axios.delete('/dashboard/' + Server.id + '/command/' + id).then(resp => {
                    this.commands = _.without(this.commands, this.getCommand(id));
                })
            } else {
                let vm = this;
                this.confirming.push(id);
                setTimeout(() => {
                    vm.confirming = _.without(vm.confirming, id);
                }, 1500)
            }
        },

        isConfirming(id) {
            return _.indexOf(this.confirming, id) !== -1;
        },

        editCommand(id) {
            let cmd = this.getCommand(id);
            if (cmd == null) {
                return; // The command wasn't found, don't edit it
            }
            this.resetEditForm();
            this.forms.editCommand.name = cmd.name;
            this.forms.editCommand.description = cmd.data;
            this.forms.editCommand.clearance = cmd.clearance_level;
            this.forms.editCommand.id = cmd.id;
            this.forms.editCommand.respect_whitelist = cmd.respect_whitelist;
            this.adding = false;
            this.showModal();
        },

        showModal() {
            $("#commandModal").modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        },

        saveCommand() {
            let method = this.addingCommand ? "put" : "patch";
            let url = '/dashboard/' + Server.id + (this.addingCommand ? '/commands' : '/command/' + this.forms.editCommand.id);
            this.forms.editCommand[method](url).then(resp => {
                if (this.addingCommand) {
                    this.commands.push(resp.data);
                } else {
                    let index = _.findIndex(this.commands, {
                        id: this.forms.editCommand.id
                    });
                    if (index === -1) {
                        console.error("Could not find command with the ID " + this.forms.editCommand.id)
                        return;
                    }
                    this.commands[index] = resp.data;
                }
                $("#commandModal").modal('hide');
            });
        },

        addCommand() {
            this.resetEditForm();
            this.addingCommand = true;
            this.showModal();
        },

        resetEditForm() {
            this.adding = false;
            this.forms.editCommand.reset();
        },

        saveDiscrim() {
            this.forms.cmdDiscriminator.save();
        },

        saveSilent() {
            this.forms.silentFail.save()
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
            readonly: App.readonly,
            adding: false,
            confirming: []
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

        isConfirming(id) {
            return _.indexOf(this.confirming, id) !== -1;
        },

        deleteAlias(id) {
            if (this.isConfirming(id)) {
                console.log(":blobowo:");
                this.removeAlias(id)
            } else {
                console.log(":awauu:");
                this.confirming.push(id);
                setTimeout(() => {
                    this.confirming = _.without(this.confirming, id);
                }, 1500);
            }
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