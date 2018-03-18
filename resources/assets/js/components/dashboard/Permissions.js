import axios from 'axios'

Vue.component('settings-permissions', {
    data() {
        return {
            permissions: [],
            user: '',
            adding: false,
            addingUser: new Form('PUT', '/dashboard/' + Server.id + '/permissions', {
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

        updatePermission(selected, id) {
            // Perform a post request to update
            console.log("Updating permissions for " + id + " to " + selected);

            axios.post('/dashboard/' + Server.id + '/permissions/' + id, {
                permission: selected
            }).then(resp => {
                this.permissions = resp.data;
            });
        },

        deletePermission(id) {
            axios.delete('/dashboard/' + Server.id + '/permissions/' + id).then(resp => {
                this.permissions = resp.data;
            })
        },
        sendForm() {
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

Vue.component('settings-role-permissions', {
    data() {
        return {
            permissions: [],
            permissionForm: new Form('PUT', '/dashboard/' + Server.id + '/rolePermissions', {
                roleId: '',
                permissionLevel: ''
            }),
            adding: false,
            readonly: ReadOnly,
            roles: Roles
        }
    },
    mounted() {
        this.onMount();
    },
    methods: {
        onMount() {
            axios.get('/dashboard/' + Server.id + '/rolePermissions').then(resp => {
                this.permissions = resp.data;
            })
        },
        updatePermissionLevel(id) {
            let p = _.find(this.permissions, {
                id: id
            });
            axios.patch('/dashboard/' + Server.id + '/rolePermissions/' + id, {
                permissionLevel: p.permission_level
            })
        },
        deletePermission(id) {
            axios.delete('/dashboard/' + Server.id + '/rolePermissions/' + id).then(resp => {
                this.permissions = _.without(this.permissions, _.find(this.permissions, {
                    id: id
                }))
            })
        },
        addPermission() {
            this.permissionForm.save().then(resp => {
                this.permissions.push(resp.data);
                this.permissionForm.roleId = "";
                this.permissionForm.permissionLevel = "";
                this.adding = false;
            })
        }
    }
});