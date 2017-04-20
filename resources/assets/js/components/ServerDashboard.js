Vue.component('settings-realname', {

    data(){
        return {
            forms: {
                realName: $.extend(true, new Form({
                    requireRealname: false,
                    realnameSetting: 'OFF',
                }), {})
            }
        }
    },


    mounted(){
        if (ServerData != null) {
            this.forms.realName.requireRealname = ServerData.require_realname;
            this.forms.realName.realnameSetting = ServerData.realname;
        }
    },

    methods: {
        sendForm(){
            if(this.forms.realName.realnameSetting === "OFF"){
                this.forms.realName.requireRealname = false;
            }
            Panel.post('/dashboard/' + Server.id + '/realname', this.forms.realName);
        }
    }
});