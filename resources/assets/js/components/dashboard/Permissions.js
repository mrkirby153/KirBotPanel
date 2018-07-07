import axios from 'axios'

Vue.component('settings-permissions', {
    data() {
        return {
            permissions: Permissions,
            user: UserId,
            adding: false,
            addingUser: new Form('PUT', '/dashboard/' + Server.id + '/permissions', {
                userId: '',
                permission: ''
            }),
            readonly: false,
            admin: Admin,
            owner: Owner
        }
    },

    methods: {

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
            })
        }
    },
    watch: {
        adding(newval) {
            if (!newval) {
                this.addingUser.userId = '';
                this.addingUser.permission = '';
                this.addingUser.successful = false;
                this.addingUser.errors.clearAll();
            }
        }
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
            readonly: App.readonly,
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
            this.updatePermissionLevel = _.debounce(this.updatePermissionLevel, 400);
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
                this.adding = false;
            })
        }
    },
    watch: {
        adding(newval) {
            if (!newval) {
                this.permissionForm.roleId = "";
                this.permissionForm.permissionLevel = "";
                this.permissionForm.errors.clearAll();
            }
        }
    }
});