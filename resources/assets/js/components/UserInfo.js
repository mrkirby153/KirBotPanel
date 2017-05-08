Vue.component('user-information', {
    data(){
        return {
            forms: {
                userData: $.extend(true, new Form({
                    firstname: '',
                    lastname: '',
                }), {})
            },
            disabled: false,
            alreadyChanged: false,
        }
    },

    mounted(){
        if (User != null)
            if (User.info !== null) {
                this.forms.userData.firstname = User.info.first_name;
                this.forms.userData.lastname = User.info.last_name;
                this.alreadyChanged = User.info.changed;
            }
        if (Name) {
            this.disabled = true;
        }
    },

    methods: {
        updateProfile(){
            let vm = this;
            if (!this.forms.userData.firstname || !this.forms.userData.lastname) {
                $("#missing-name").modal('show');
                return
            }
            $("#confirm-set-name").modal({
                closable: false,
                transition: 'scale',
                blurring: true,
                onApprove(){
                    Panel.post('/name', vm.forms.userData).then(resp => {
                       vm.alreadyChanged = resp.data.changed;
                        vm.disabled = true;
                        setTimeout(() => {
                            vm.forms.userData.successful = false
                        }, 1500);
                    });
                }
            }).modal('show');
        },
        activateForm(){
            let vm = this;
            $("#confirm-reactivate").modal({
                onApprove(){
                    vm.disabled = false;
                    vm.alreadyChanged = true;
                }
            }).modal('show');
        }
    }
});