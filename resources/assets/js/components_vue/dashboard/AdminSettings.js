import Vue from 'vue';
import axios from 'axios';
import toastr from 'toastr';

Vue.component('admin-settings', {


    data() {
        return {
            guilds: [],
            selected: null,
            property_name: "",
            property_value: ""
        }
    },

    mounted() {
        this.onMount();
    },

    computed: {
        settings() {
            if (this.selected !== null) {
                let guild = _.find(this.guilds, {id: this.selected});
                return guild !== undefined ? guild.settings : [];
            }
            return [];
        }
    },

    methods: {
        onMount() {
            this.getGuilds();
        },

        getGuilds() {
            axios.get('/admin/settings').then(resp => {
                this.guilds = resp.data;
            })
        },

        updateKey(evt) {
            this.property_name = evt.target.value;
            let v = _.find(this.settings, {key: this.property_name}).value;
            if(v instanceof Object) {
                this.property_value = JSON.stringify(v);
            } else {
                this.property_value = v
            }
        },

        update() {
            axios.post('/admin/settings/' + this.selected + '/' + this.property_name, {
                value: this.property_value
            }).then(resp => {
                this.getGuilds();
                toastr["success"]("Settings saved!")
            })
        },

        del() {
            axios.post('/admin/settings/' + this.selected + '/' + this.property_name).then(resp => {
                this.property_name = null;
                this.property_value = null;
                this.getGuilds();
                toastr["success"]("Key deleted!")
            })
        }
    }
});