import JSONEditor from 'jsoneditor'
import axios from 'axios'
import {CensorSchema, SpamSchema} from "./Schemas";
import SettingsRepository from "../../settings";

Vue.component('settings-spam', {
    data() {
        return {
            editor: null,
            loading: false,
            success: false,
            readonly: App.readonly,
            changed: false,
            original: "",
            confirmDiscard: false
        }
    },

    mounted() {
        let container = document.getElementById("spam-settings");
        let vm = this;
        this.editor = new JSONEditor(container, {
            mode: 'code',
            onEditable(node) {
                if (!node.path) {
                    if (this.busy) {
                        return false;
                    }
                    return !this.readonly
                }
            },
            onChange() {
                vm.changed = true
            },
            schema: SpamSchema
        });
        let parsed = SettingsRepository.getSettings("spam_settings");
        this.original = parsed;
        this.editor.set(parsed);
    },

    methods: {
        discard() {
            if (this.confirmDiscard) {
                this.changed = false;
                this.editor.set(this.original);
                this.confirmDiscard = false;
            } else {
                this.confirmDiscard = true;
            }

        },
        save() {
            this.loading = true;
            this.success = false;
            let json = JSON.stringify(this.editor.get());
            console.log("Saving json " + json);
            axios.patch('/dashboard/' + Server.id + '/spam', {
                'settings': json
            }).then(resp => {
                this.loading = false;
                this.success = true;
                this.changed = false;
                let vm = this;
                setTimeout(() => {
                    vm.success = false;
                }, 10000);
            }).catch(resp => {
                this.loading = false;
            })
        }
    }
});

Vue.component('settings-censor', {
    data() {
        return {
            editor: null,
            loading: false,
            success: false,
            readonly: App.readonly,
            changed: false,
            original: "",
            confirmDiscard: false
        }
    },

    mounted() {
        let container = document.getElementById("censor-settings");
        let vm = this;
        this.editor = new JSONEditor(container, {
            mode: 'code',
            onEditable(node) {
                if (!node.path){
                    if(vm.loading){
                       return false;
                    }
                    return !vm.readonly
                }
            },
            onChange() {
                vm.changed = true
            },
            schema: CensorSchema
        });
        let parsed = SettingsRepository.getSettings('censor_settings');
        this.original = parsed;
        this.editor.set(parsed);
    },

    methods: {
        discard() {
            if (this.confirmDiscard) {
                this.changed = false;
                this.editor.set(this.original);
                this.confirmDiscard = false;
            } else {
                this.confirmDiscard = true;
            }

        },
        save() {
            this.loading = true;
            this.success = false;
            let json = JSON.stringify(this.editor.get());
            console.log("Saving json " + json);
            axios.patch('/dashboard/' + Server.id + '/censor', {
                'settings': json
            }).then(resp => {
                this.loading = false;
                this.success = true;
                this.changed = false;
                let vm = this;
                setTimeout(() => {
                    vm.success = false;
                }, 10000);
            }).catch(resp => {
                this.loading = false;
            })
        }
    }

});