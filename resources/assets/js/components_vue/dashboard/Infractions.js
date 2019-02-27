Vue.component('infractions', {
    data() {
        return {
            infractions: [],
            filter: {
                id: '',
                uid: '',
                modId: ''
            },
            page: 1,
            busy: false
        }
    },

    mounted() {
        this.onMount();
    },

    methods: {
        onMount() {
            this.getInfractions();
        },

        getInfractionUrl(id) {
            return '/dashboard/' + Server.id + '/infractions/' + id;
        },

        getInfractions() {
            this.busy = true;
            axios.get('/dashboard/' + Server.id + '/api/infractions?page=' + this.page + '&id='
                + encodeURIComponent(this.filter.id) + '&uid=' + encodeURIComponent(this.filter.uid) + '&mid='
                + encodeURIComponent(this.filter.modId)).then(resp => {
                this.infractions = resp.data;
                if (this.infractions.last_page < this.page) {
                    this.page = this.infractions.last_page;
                    this.getInfractions();
                    return;
                }
                this.busy = false;
            })
        },

        nextPage() {
            this.page++;
            this.getInfractions();
            $("html, body").animate({scrollTop: 0}, "slow");
        },

        prevPage() {
            this.page--;
            this.getInfractions();
            $("html, body").animate({scrollTop: 0}, "slow");
        }
    }
});