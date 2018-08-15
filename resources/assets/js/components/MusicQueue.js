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
            let hours = Math.floor(seconds / 3600);
            seconds -= hours * 3600;
            let minutes = Math.floor(seconds / 60);
            seconds = seconds - (minutes * 60);
            if (seconds < 10) {
                seconds = "0" + seconds
            }
            let s = "";
            if (hours > 0) {
                if (hours < 10) {
                    hours = "0" + hours;
                }
                s += hours + ":";
            }
            s += minutes + ":" + seconds;
            return s;
        },
        getYoutubeThumbnail(url) {
            let regex = RegExp("(https?\\:\\/\\/)?(www\\.youtube\\.com|youtu\\.?be)\\/(watch\\?v=)?(.{11})");
            let groups = regex.exec(url);
            if (groups != undefined) {
                let videoId = groups[4];
                return "https://i.ytimg.com/vi/" + videoId + "/0.jpg"
            } else {
                return window.location.origin+"/images/album-art-empty.png";
            }
        }
    },
    computed: {
        queueLength() {
            let duration = 0;
            this.queue.forEach(item => {
                duration += item.duration
            });
            return this.formatTime(duration);
        }
    }
});