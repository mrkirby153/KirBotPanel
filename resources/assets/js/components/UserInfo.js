Vue.component('user-information', {
    data(){
        return {
            forms: {
                userData: $.extend(true, new Form({
                    firstname: '',
                    lastname: '',
                }), {})
            }
        }
    },

    mounted(){
        if (User.info !== null) {
            this.forms.userData.firstname = User.info.first_name;
            this.forms.userData.lastname = User.info.last_name;
        }

    },

    methods: {
        retrieveUserData(){
            axios.get('/name/')
        },

        updateProfile(){
            Panel.post('/name', this.forms.userData).catch(() => {
                console.log(this.forms.userData.errors.all())
            });
        }
    }
});