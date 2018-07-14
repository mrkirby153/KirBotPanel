@extends('layouts.dashboard')

@section('panel')
    <div class="row">
        <div class="col-12">
            <h2>Spam Settings</h2>
            <p>
                <b>Available Rules</b><br/>
                The following rules are available for each clearance level: <code>max_messages, max_newlines,
                    max_mentions, max_links, max_emoji, max_uppercase, max_attachments</code>. Each Rule has two options
                <code>count and period</code>. "count" is the number of violations that will trigger action, "period" is
                the time (in seconds) in which the bot looks.
            </p>
            <p class="mb-0">
                <b>Available Actions</b><br/>
                The following actions are available and can be set with the <code>punishment</code> string in the root
                of the element. For temporary actions, provide a <code>punishment_duration</code> in seconds.
            </p>
            <ul>
                <li><b>NONE: </b>Take no action</li>
                <li><b>MUTE: </b>Permanently mute the user</li>
                <li><b>KICK: </b>Kick the user from the server</li>
                <li><b>BAN: </b>Ban the user from the server</li>
                <li><b>TEMPMUTE: </b>Temporarily mute the user</li>
            </ul>
            <settings-spam inline-template>
                <div>
                    <transition name="fade">
                        <div class="alert alert-success" v-if="success">
                            Spam settings have been updated
                        </div>
                    </transition>
                    <transition name="fade">
                        <div class="btn-group mb-2" v-if="changed">
                            <button class="btn btn-warning" @click="discard" :disabled="loading"><span
                                        v-if="confirmDiscard">Confirm?</span><span v-else>Discard Changes</span></button>
                            <button class="btn btn-success" @click="save" :disabled="loading">Save Changes</button>
                        </div>
                    </transition>
                    <div id="spam-settings" class="settings-editor" :class="{'busy': loading}"></div>
                </div>
            </settings-spam>
        </div>
    </div>

    <div class="row mt-5">
        <div class="col-12">
            <h2>Censor Settings</h2>
            <p class="mb-0">
                <b>Available Rules:</b>
            </p>
            <ul>
                <li><b>Invites: </b>Censor invites. Keys: <code>enabled, whitelist, guild_whitelist, blacklist, guild_blacklist</code></li>
                <li><b>Domains: </b>Censor domains. Keys: <code>enabled, whitelist, blacklist</code></li>
                <li><b>blocked_tokens: </b>Blocks tokens (can appear in the word anywhere) [array]</li>
                <li><b>blocked_words: </b>Blocked words (words separated by a space) [array]</li>
                <li><b>zalgo: </b>Block Zalgo text from being sent [boolean]</li>
            </ul>
            <settings-censor inline-template>
                <div>
                    <transition name="fade">
                        <div class="alert alert-success" v-if="success">
                            Censor settings have been updated
                        </div>
                    </transition>
                    <transition name="fade">
                        <div class="btn-group mb-2" v-if="changed">
                            <button class="btn btn-warning" @click="discard" :disabled="loading"><span
                                        v-if="confirmDiscard">Confirm?</span><span v-else>Discard Changes</span></button>
                            <button class="btn btn-success" @click="save" :disabled="loading">Save Changes</button>
                        </div>
                    </transition>
                    <div id="censor-settings" class="settings-editor" :class="{'busy': loading}"></div>
                </div>
            </settings-censor>
        </div>
    </div>
@endsection