import Form from "../../form/form2";

Vue.component('settings-music', {
    data() {
        return {
            forms: {
                music: new Form('post', '/dashboard/'+Server.id+'/music', {
                    enabled: true,
                    whitelist_mode: 'OFF',
                    channels: [],
                    blacklisted_urls: '',
                    max_queue_length: -1,
                    max_song_length: -1,
                    skip_cooldown: 0,
                    skip_timer: 30,
                    playlists: false
                })
            }
        }
    },

    mounted() {
        this.forms.music.enabled = Music.enabled;
        this.forms.music.whitelist_mode = Music.mode;
        this.forms.music.blacklisted_urls = Music.blacklist_songs.replace(new RegExp(',', 'g'), "\n");
        if (Music.mode !== 'OFF')
            this.forms.music.channels = Music.channels;

        this.forms.music.max_queue_length = Music.max_queue_length;
        this.forms.music.max_song_length = Music.max_song_length;
        this.forms.music.skip_cooldown = Music.skip_cooldown;
        this.forms.music.skip_timer = Music.skip_timer;
        this.forms.music.playlists = Music.playlists;
    },

    methods: {
        sendForm() {
            this.forms.music.save();
        },
        capitalizeFirstLetter(string) {
            string = string.toLowerCase();
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
});