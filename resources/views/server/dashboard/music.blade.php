@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab);
    ?>
    <settings-music inline-template>
        <div>
            <panel-form :form="forms.music" @submit="sendForm">
                <div slot="inputs">
                    <div class="ui {{$color}} segment">
                        <h2>Master Switch</h2>
                        <p>Enabling the DJ will allow KirBot to play music in voice channels on your server. Configure options below</p>
                        <field name="enabled" :form="forms.music">
                            <div class="ui toggle checkbox">
                                <input type="checkbox" v-model="forms.music.enabled" name="enabled" @change="sendForm" :disabled="readonly">
                                <label><b>Enable DJ</b></label>
                            </div>
                        </field>
                    </div>
                    <transition name="fade">
                        <div v-show="forms.music.enabled">
                            <div class="ui {{$color}} segment">
                                <h2 v-if="forms.music.whitelist_mode == 'OFF'">Channel Whitelist/Blacklist</h2>
                                <h2 v-else>Channel @{{ capitalizeFirstLetter(forms.music.whitelist_mode) }}</h2>
                                <p><span v-if="forms.music.whitelist_mode == 'OFF'">Blacklist/Whitelist</span>
                                    <span v-else> @{{ capitalizeFirstLetter(forms.music.whitelist_mode) }}</span> channels that KirBot can play music in
                                </p>
                                <div class="two fields">
                                    <field name="whitelist_mode" :form="forms.music">
                                        <label><b>Mode</b></label>
                                        <select class="ui fluid dropdown" v-model="forms.music.whitelist_mode" name="whitelist_mode" @change="sendForm" :disabled="readonly">
                                            <option value="OFF">Off</option>
                                            <option value="WHITELIST">Whitelist</option>
                                            <option value="BLACKLIST">Blacklist</option>
                                        </select>
                                    </field>
                                    <field name="channels" :form="forms.music"
                                            :class="{'disabled': forms.music.whitelist_mode == 'OFF'}" v-show="forms.music.whitelist_mode != 'OFF'">
                                        <label><b>Channels</b></label>
                                        <select class="ui fluid search dropdown" multiple="" name="channels[]" v-model="forms.music.channels" name="channels" @change="sendForm" :disabled="readonly">
                                            @foreach($channels as $channel)
                                                @if($channel->type == 'VOICE')
                                                    <option value="{{$channel->id}}">{{$channel->channel_name}}</option>
                                                @endif
                                            @endforeach
                                        </select>
                                    </field>
                                </div>
                            </div>
                            <div class="ui horizontal segments">
                                <div class="ui {{$color}} segment">
                                    <h2>Queue Settings</h2>
                                    <div class="three fields">
                                        <field name="max_queue_length" :form="forms.music">
                                            <label>Queue Length</label>
                                            <p>The maximum length (in minutes) that the queue can be. -1 to disable</p>
                                            <input type="number" v-model="forms.music.max_queue_length" name="max_queue_length" @change="sendForm" :disabled="readonly"/>
                                        </field>
                                        <field name="max_song_length" :form="forms.music">
                                            <label>Max Song Length</label>
                                            <p>The maximum song length (in minutes) that can be queued. -1 to disable</p>
                                            <input type="number" v-model="forms.music.max_song_length" name="max_song_length" @change="sendForm" :disabled="readonly"/>
                                        </field>
                                        <field name="playlists" :form="forms.music">
                                            <label>Playlists</label>
                                            <p>If users are allowed to queue playlists<br/>&nbsp;</p>
                                            <select class="ui fluid dropdown" v-model="forms.music.playlists" name="playlists" @change="sendForm" :disabled="readonly">
                                                <option value="0">No</option>
                                                <option value="1">Yes</option>
                                            </select>
                                        </field>
                                    </div>
                                </div>
                                <div class="ui {{$color}} segment">
                                    <h2>Skip Settings</h2>
                                    <div class="two fields">
                                        <field name="skip_cooldown" :form="forms.music">
                                            <label>Skip Cooldown</label>
                                            <p>The time (in seconds) a user has to wait after starting a skip vote to start one again</p>
                                            <input type="number" v-model="forms.music.skip_cooldown" name="skip_cooldown" @change="sendForm" :disabled="readonly"/>
                                        </field>
                                        <field name="skip_timer" :form="forms.music">
                                            <label>Skip Timer</label>
                                            <p>How long (in seconds) to wait for votes before tallying and skipping songs<br/>&nbsp;</p>
                                            <input type="number" v-model="forms.music.skip_timer" name="skip_timer" @change="sendForm" :disabled="readonly"/>
                                        </field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </panel-form>
        </div>
    </settings-music>

@endsection