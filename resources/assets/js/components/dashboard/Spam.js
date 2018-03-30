import JSONEditor from 'jsoneditor'
import axios from 'axios'

Vue.component('settings-spam', {
    data() {
        return {
            editor: null,
            loading: false,
            success: false,
            fail: false,
            readonly: ReadOnly,
            changed: false,
            original: ""
        }
    },

    mounted() {
        let container = document.getElementById("jsoneditor");
        let vm = this;
        this.editor = new JSONEditor(container, {
            mode: 'code',
            onEditable(node) {
                if (!node.path)
                    return !ReadOnly
            },
            onChange() {
                vm.changed = true
            }
        });
        let parsed = JSON.parse(JSON.parse(SpamSettings).settings);
        this.original = parsed;
        this.editor.set(SpamSettings !== null ? parsed : {});
    },

    methods: {
        discard() {
            let vm = this;
            $("#confirm-revert").modal({
                onApprove(){
                    vm.editor.set(vm.original);
                    vm.changed = false;
                }
            }).modal('show');

        },
        save() {
            this.loading = true;
            this.success = false;
            this.fail = false;
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
                this.fail = true;
                this.loading = false;
            })
        }
    }
});