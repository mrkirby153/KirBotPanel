import Form from "../../form/form2";

Vue.component('settings-music', {
    data() {
        return {
            music: new Form('post', '/dashboard/' + Server.id + '/music', {
                enabled: Music.enabled,
                whitelist_mode: Music.mode,
                channels: Music.mode !== 'OFF' ? Music.channels : [],
                blacklisted_urls: '',
                max_queue_length: Music.max_queue_length,
                max_song_length: Music.max_song_length,
                skip_cooldown: Music.skip_cooldown,
                skip_timer: Music.skip_timer,
                playlists: Music.playlists
            }),
            readonly: App.readonly,
            selecting: "",
        }
    },

    computed: {
        channels() {
            let vc = _.filter(Server.channels, c => {
                return c.type === "VOICE"
            });
            let chans = [];
            vc.forEach(chan => {
                if (_.indexOf(this.music.channels, chan.id) === -1) {
                    chans.push(chan);
                }
            });
            return chans;
        },
        selectedChannels() {
            let chans = [];
            this.music.channels.forEach(cId => {
                let found = _.find(Server.channels, {
                    id: cId
                });
                if (found !== undefined)
                    chans.push(found)
            });
            return chans;
        }
    },

    methods: {
        sendForm() {
            if (this.readonly)
                return;
            this.music.save();
        },
        capitalizeFirstLetter(string) {
            string = string.toLowerCase();
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        addEntry() {
            setTimeout(() => {
                this.music.channels.push(this.selecting);
                this.selecting = "";
                this.sendForm();
            }, 250);
        },
        removeEntry(id) {
            this.music.channels = _.without(this.music.channels, id);
            this.sendForm();
        }
    }
});