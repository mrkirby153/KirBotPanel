Vue.component('user-information', {
    data(){
        return {
            forms: {
                userData: new Form('post', '/name', {
                    firstname: '',
                    lastname: ''
                })
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
            this.forms.userData.save();
            this.alreadyChanged = true;
            setTimeout(()=>{
                vm.forms.userData.successful = false;
            });
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