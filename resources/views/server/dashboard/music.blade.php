@extends('layouts.dashboard')

@section('panel')
    <settings-music inline-template>
        <div>
            <div class="row">
                <div class="col-12">
                    <h2>Master Switch</h2>
                    <p>
                        This switch allows KirBot to play music in voice channels on your server. Configure options
                        below.
                        If this is disabled,
                        the bot will ignore all music related commands, and they will not show up in help
                    </p>
                    <input-switch label="Master Switch" v-model="music.enabled" @change="sendForm"></input-switch>
                </div>
            </div>
            <transition name="fade">
                <div class="music-wrapper" v-show="music.enabled">
                    <hr/>
                    <div class="row">
                        <div class="col-12">
                            <h2>Channel Whitelist/Blacklist</h2>
                            <div class="form-row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="form-group">
                                        <label><b>Mode</b></label>
                                        <select class="form-control" v-model="music.whitelist_mode" @change="sendForm">
                                            <option value="OFF">Off</option>
                                            <option value="WHITELIST">Whitelist</option>
                                            <option value="BLACKLIST">Blacklist</option>
                                        </select>
                                    </div>
                                </div>
                                <transition name="fade">
                                    <div class="col-lg-6 col-md-12" v-if="music.whitelist_mode !== 'OFF'">
                                        <div class="form-group">
                                            <label><b>Add Channel</b></label>
                                            <select class="form-control" v-model="selecting" @change="addEntry">
                                                <option value="" selected disabled>Select a channel</option>
                                                <option v-for="channel in channels" :key="channel.id" :value="channel.id">
                                                    @{{ channel.channel_name }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                            <transition-group name="scale-fast" class="channel-whitelist">
                                <div class="channel" v-for="channel in selectedChannels" :key="channel.id" v-if="music.whitelist_mode !== 'OFF'">
                                    @{{ channel.channel_name }} <span class="x-icon" @click="removeEntry(channel.id)"><i class="fas fa-times"></i></span>
                                </div>
                            </transition-group>
                        </div>
                    </div>
                    <hr/>
                    <div class="row">
                        <div class="col-12">
                            <h2>Queue Settings</h2>
                            <p>
                                Controls various aspects of the queue
                            </p>
                            <div class="form-row">
                                <div class="col-lg-4 col-md-12">
                                    <div class="form-group">
                                        <label><b>Queue Length</b></label>
                                        <input type="number" min="-1" class="form-control" v-model="music.max_queue_length" @change="sendForm"/>
                                        <small class="form-text text-muted">
                                            The max length in minutes the queue can be. -1 to disable
                                        </small>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-12">
                                    <div class="form-group">
                                        <label><b>Max Song Length</b></label>
                                        <input type="number" min="-1" class="form-control" v-model="music.max_song_length" @change="sendForm"/>
                                        <small class="form-text text-muted">
                                            The max song length in minutes that can be queued. -1 to disable
                                        </small>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-12">
                                    <div class="form-group">
                                        <label><b>Allow Playlists</b></label>
                                        <select class="form-control" v-model="music.playlists" @change="sendForm">
                                            <option :value="false">No</option>
                                            <option :value="true">Yes</option>
                                        </select>
                                        <small class="form-text text-muted">
                                            If users are allowed to queue playlists
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div class="row">
                        <hr/>
                        <div class="col-12">
                            <h2>Skip Settings</h2>
                            <p>
                                Configure settings for vote skipping
                            </p>
                            <div class="form-row">
                                <div class="col-lg-6 col-md-12">
                                    <div class="form-group">
                                        <label><b>Skip Cooldown</b></label>
                                        <input type="number" min="0" class="form-control" v-model="music.skip_cooldown" @change="sendForm"/>
                                        <small class="form-text text-muted">The time in seconds a user has to wait
                                            between
                                            starting a skip vote
                                        </small>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-12">
                                    <div class="form-group">
                                        <label><b>Skip Timer</b></label>
                                        <input type="number" min="0" class="form-control" v-model="music.skip_timer" @change="sendForm"/>
                                        <small class="form-text text-muted">How long the bot waits for votes</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </settings-music>
@endsection