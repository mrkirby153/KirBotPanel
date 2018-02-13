import axios from 'axios'

Vue.component('settings-permissions', {
    data() {
        return {
            permissions: [],
            user: '',
            adding: false,
            addingUser: new Form('PUT', '/dashboard/'+Server.id+'/permissions', {
                userId: '',
                permission: 'VIEW'
            }),
            readonly: ReadOnly
        }
    },

    methods: {
        onMount() {
            this.permissions = Permissions;
            this.user = UserId;
        },

        updatePermission(event, id) {
            let target = event.target;
            let selected = target.options[target.selectedIndex].value;
            // Perform a post request to update
            console.log("Updating permissions for " + id + " to " + selected);

            axios.post('/dashboard/' + Server.id + '/permissions/' + id, {
                permission: selected
            }).then(resp => {
                this.permissions = resp.data;
            });
        },

        deletePermission(id){
            axios.delete('/dashboard/'+Server.id+'/permissions/'+id).then(resp => {
                this.permissions = resp.data;
            })
        },
        sendForm(){
            this.addingUser.save().then(resp => {
                this.permissions = resp.data;
                this.adding = false;
                this.addingUser.userId = '';
                this.addingUser.permission = 'VIEW';
                this.addingUser.successful = false;
            })
        }
    },

    mounted() {
        this.onMount();
    }

});