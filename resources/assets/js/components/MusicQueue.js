Vue.component('music-queue', {
    data() {
        return {
            nowPlaying: {},
            queue: [],
            timer: -1
        }
    },

    props: ['server', 'discrim'],


    mounted() {
        this.getQueue();
        let vm = this;
        setInterval(() => {
            vm.getQueue()
        }, 5000)
    },

    methods: {
        getQueue() {
            axios.get('/api/' + this.server + '/queue').then(resp => {
                this.nowPlaying = resp.data.nowPlaying;
                this.queue = resp.data.queue;
            })
        },
        formatTime(seconds) {
            let minutes = Math.floor(seconds / 60);
            seconds = seconds - (minutes * 60);
            if (seconds < 10) {
                seconds = "0" + seconds
            }
            return minutes + ":" + seconds
        }
    }
});