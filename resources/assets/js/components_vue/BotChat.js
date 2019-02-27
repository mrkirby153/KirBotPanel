Vue.component('bot-chat', {
    data() {
        return {
            servers: [],
            channels: [],
            selected_server: '',
            selected_channel: '',
            message: '',
            loading: false
        }
    },

    mounted() {
        this.getServers();
    },

    methods: {
        getServers() {
            axios.get('/api/chat/servers').then(resp => {
                this.servers = resp.data;
            })
        },

        getChannels() {
            axios.get('/api/chat/servers/' + this.selected_server).then(resp => {
                this.channels = resp.data;
            })
        },

        sendMessage() {
            this.loading = true;
            axios.post('/api/chat', {
                channel: this.selected_channel,
                message: this.message,
                server: this.selected_server
            }).then(resp => {
                this.message = '';
                this.loading = false;
            }).catch(resp =>{
                this.loading = false;
            });
        }
    }
});