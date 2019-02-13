import Form from "../../form/form2";
import SettingsRepository from "../../settings";

Vue.component('settings-music', {
    data() {
        return {
            music: new Form('post', '/dashboard/' + Server.id + '/music', {
                enabled: SettingsRepository.getSettings("music_enabled"),
                whitelist_mode: SettingsRepository.getSettings("music_mode"),
                channels: SettingsRepository.getSettings("music_mode") !== 'OFF' ? SettingsRepository.getSettings("music_channels") : [],
                max_queue_length: SettingsRepository.getSettings("music_max_queue_length"),
                max_song_length: SettingsRepository.getSettings("music_max_song_length"),
                skip_cooldown: SettingsRepository.getSettings("music_skip_cooldown"),
                skip_timer: SettingsRepository.getSettings("music_skip_timer"),
                playlists: SettingsRepository.getSettings("music_playlists") === 1
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