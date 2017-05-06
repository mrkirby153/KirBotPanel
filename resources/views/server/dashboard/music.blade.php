@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab);
    ?>
    <settings-music inline-template>
        <div>
            <form class="ui form" :class="{'loading': forms.music.busy, 'success': forms.music.successful, 'error':forms.music.errors.hasErrors()}">
                <button class="ui button green" @click.prevent="sendForm" :class="{'loading': forms.music.busy}">Save</button>
                <form-messages success-header="Success" success-body="Settings updated!" :error-array="forms.music.errors.flatten()"></form-messages>
                <div class="ui {{$color}} segment">
                    <h2>Master Switch</h2>
                    <p>Enabling the DJ will allow KirBot to play music in voice channels on your server. Configure options below</p>
                    <div class="field">
                        <div class="ui checkbox">
                            <input type="checkbox" v-model="forms.music.enabled"/>
                            <label><b>Enable DJ</b></label>
                        </div>
                    </div>
                </div>
                <transition name="fade">
                    <div v-show="forms.music.enabled">
                        <div class="ui {{$color}} segment">
                            <h2 v-if="forms.music.whitelist_mode == 'OFF'">Channel Whitelist/Blacklist</h2>
                             <h2 v-else>Channel @{{ capitalizeFirstLetter(forms.music.whitelist_mode) }}</h2>
                            <p><span v-if="forms.music.whitelist_mode == 'OFF'">Blacklist/Whitelist</span>
                                <span v-else> @{{ capitalizeFirstLetter(forms.music.whitelist_mode) }}</span> channels that KirBot can play music in</p>
                            <form>
                                <div class="two fields">
                                    <div class="field">
                                        <label><b>Mode</b></label>
                                        <select class="ui fluid dropdown" v-model="forms.music.whitelist_mode">
                                            <option value="OFF">Off</option>
                                            <option value="WHITELIST">Whitelist</option>
                                            <option value="BLACKLIST">Blacklist</option>
                                        </select>
                                    </div>
                                    <transition name="fade">
                                        <div class="field" :class="{'disabled': forms.music.whitelist_mode == 'OFF'}" v-show="forms.music.whitelist_mode != 'OFF'">
                                            <label><b>Channels</b></label>
                                            <select class="ui fluid search dropdown" multiple="" name="channels[]" v-model="forms.music.channels">
                                                @foreach($channels as $channel)
                                                    @if($channel->type == 'VOICE')
                                                        <option value="{{$channel->id}}">{{$channel->channel_name}}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                        </div>
                                    </transition>
                                </div>
                            </form>
                        </div>
                        <div class="ui {{$color}} segment">
                            <h2>Blacklisted Songs</h2>
                            <p>URLs in this text box will not be able to be played by the robot.<br/><i>One URL per line</i>
                            </p>
                            <div class="field">
                                <textarea v-model="forms.music.blacklisted_urls"></textarea>
                            </div>
                        </div>
                        <div class="ui horizontal segments">
                            <div class="ui {{$color}} segment">
                                <h2>Queue Settings</h2>
                                <div class="two fields">
                                    <div class="field">
                                        <label>Queue Length</label>
                                        <p>The maximum length (in minutes) that the queue can be. -1 to disable</p>
                                        <input type="number" v-model="forms.music.max_queue_length"/>
                                    </div>
                                    <div class="field">
                                        <label>Max Song Length</label>
                                        <p>The maximum song length (in minutes) that can be queued. -1 to disable</p>
                                        <input type="number" v-model="forms.music.max_song_length"/>
                                    </div>
                                </div>
                            </div>
                            <div class="ui {{$color}} segment">
                                <h2>Skip Settings</h2>
                                <div class="two fields">
                                    <div class="field">
                                        <label>Skip Cooldown</label>
                                        <p>The time (in seconds) a user has to wait after starting a skip vote to start one again</p>
                                        <input type="number" v-model="forms.music.skip_cooldown"/>
                                    </div>
                                    <div class="field">
                                        <label>Skip Timer</label>
                                        <p>How long (in seconds) to wait for votes before tallying and skipping songs</p>
                                        <input type="number" v-model="forms.music.skip_timer"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </form>
        </div>
    </settings-music>

@endsection