Vue.component('settings-channels', {
    data() {
        return {
            channels: [],
            readonly: ReadOnly
        }
    },

    mounted() {
        this.channels = Channels;
    },

    computed: {
        textChannels() {
            return _.reject(this.channels, chan => chan.type === "VOICE")
        },
        voiceChannels() {
            return _.reject(this.channels, chan => chan.type === "TEXT")
        }
    },

    methods: {
        channelVisibility(channel, visibility) {
            let chan = this.textChannels[channel];
            axios.post('/dashboard/' + ServerId + '/channels/' + chan.id + '/visibility', {
                visible: visibility
            }).then(() => {
                this.channels[_.indexOf(this.channels, chan)].hidden = !visibility
            })
        },
        regainAccess(channel) {
            let chan = this.textChannels[channel];
            axios.post('/dashboard/' + ServerId + '/channels/' + chan.id + '/access')
        }
    }
});