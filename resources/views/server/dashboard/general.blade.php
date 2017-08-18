@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab)
    ?>
    <div class="ui {{$color}} segment">
        <h2>Real Name Settings</h2>
        <settings-realname inline-template>
            <form class="ui form" :class="{'loading': forms.realName.busy, 'success': forms.realName.successful}" @submit.prevent="sendForm">
                <div class="ui success message">
                    Settings saved!
                </div>
                <div class="two fields">
                    <div class="field" :class="{'disabled': forms.realName.realnameSetting == 'OFF'}">
                        <div class="ui checkbox">
                            <input type="checkbox" name="real_name_required" id="real_name_required" v-model="forms.realName.requireRealname"/>
                            <label>Require Real Names</label>
                        </div>
                        <p>If checked, users will be assigned a role if they have not set their real name</p>
                    </div>
                    <div class="field">
                        <label>Real Name</label>
                        <select class="ui fluid dropdown" name="real_name_setting" id="real_name_setting" v-model="forms.realName.realnameSetting">
                            <option value="OFF">Disabled</option>
                            <option value="FIRST_ONLY">Display first name only</option>
                            <option value="FIRST_LAST">Display first and last name</option>
                        </select>
                    </div>
                </div>
                <button class="ui button fluid green" @click.prevent="sendForm">Save</button>
            </form>
        </settings-realname>
    </div>
    <div class="ui {{$color}} segment">
        <h2>Logging</h2>
        <p>Enabling this module will log various actions taken by the bot to a designated channel</p>
        <settings-logging inline-template>
            <form class="ui form" :class="{'loading': forms.logging.busy, 'success': forms.logging.successful, 'error':forms.logging.errors.hasErrors()}" @submit.prevent="save">
                <form-messages success-header="Success!" success-body="Settings have been saved!" :error-array="forms.logging.errors.flatten()"></form-messages>
                <div class="two fields">
                    <div class="field">
                        <div class="ui checkbox">
                            <input type="checkbox" name="logging_enabled" id="logging_enabled" v-model="forms.logging.enabled"/>
                            <label>Enable</label>
                        </div>
                    </div>
                    <div class="field" :class="{'disabled': !forms.logging.enabled}">
                        <label>Logging Channel</label>
                        <select class="ui search selection fluid dropdown" name="logging_channel" id="logging_channel" v-model="forms.logging.channel">
                            @foreach($textChannels as $channel)
                                @if($channel->type == 'TEXT')
                                    <option value="{{$channel->id}}">#{{$channel->channel_name}}</option>
                                @endif
                            @endforeach
                        </select>
                    </div>
                </div>
                <button class="ui button fluid green" @click.prevent="save">Save</button>
            </form>
        </settings-logging>
    </div>
    <div class="ui grid">
        <div class="eight wide column">
            <div class="ui {{$color}} segment">
                <h2>Channel Whitelist</h2>
                <settings-channel-whitelist inline-template>
                    <form class="ui form" :class="{'loading': forms.whitelist.busy, 'success': forms.whitelist.successful, 'error': forms.whitelist.errors.hasErrors()}">
                        <form-messages success-header="Success!" success-body="Settings have been saved!" :error-array="forms.whitelist.errors.flatten()"></form-messages>
                        <p>Channels specified here are the only channels in which bot commands can be run. The bot will ignore commands from other channels. Leave blank to allow all channels</p>
                        <div class="field">
                            <label><b>Channels</b></label>
                            <select class="ui fluid search dropdown" multiple="" name="channels[]" v-model="forms.whitelist.channels">
                                @foreach($textChannels as $channel)
                                    @if($channel->type == 'TEXT')
                                        <option value="{{$channel->id}}">#{{$channel->channel_name}}</option>
                                    @endif
                                @endforeach
                            </select>
                        </div>
                        <button class="ui button fluid green" @click.prevent="save">Save</button>
                    </form>
                </settings-channel-whitelist>
            </div>
        </div>

        <div class="eight wide column">
            <div class="ui {{$color}} segment">
                <h2>Bot Manager Roles</h2>
                <p>Users with the following roles can access commands that are restricted to the "Bot Manager" role</p>
                <settings-bot-manager inline-template>
                    <form class="ui form" :class="{'loading': forms.roles.busy, 'success': forms.roles.successful, 'error': forms.roles.errors.hasErrors()}" @change="forms.roles.errors.forget()">
                        <form-messages success-header="Success!" success-body="Settings have been saved!" :error-array="forms.roles.errors.flatten()"></form-messages>
                        <div class="field">
                            <label><b>Roles</b></label>
                            <select class="ui fluid search dropdown" multiple="" name="roles[]" v-model="forms.roles.roles">
                                @foreach($roles as $role)
                                    <option value="{{$role->id}}">{{$role->name}}</option>
                                @endforeach
                            </select>
                        </div>
                        <button class="ui button fluid green" @click.prevent="save">Save</button>
                    </form>
                </settings-bot-manager>
            </div>
        </div>
    </div>

@endsection