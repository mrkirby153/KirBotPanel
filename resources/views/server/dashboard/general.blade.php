@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab)
    ?>
    <div class="ui {{$color}} segment">
        <h2>Real Name Settings</h2>
        <settings-realname inline-template>
            <panel-form :form="forms.realName">
                <div slot="inputs">
                    <div class="two fields">
                        <field name="requireRealname" :form="forms.realName" :class="{'disabled': forms.realName.realnameSetting == 'OFF'}">
                            <div class="ui checkbox">
                                <input type="checkbox" name="requireRealname" v-model="forms.realName.requireRealname"/>
                                <label>Require Real Names</label>
                            </div>
                            <p>If checked, users will be assigned a role if they have not set their real name</p>
                        </field>
                        <field name="realnameSetting" :form="forms.realName">
                            <label>Real Name</label>
                            <select class="ui fluid dropdown" name="realName" v-model="forms.realName.realnameSetting">
                                <option value="OFF">Disabled</option>
                                <option value="FIRST_ONLY">Display first name only</option>
                                <option value="FIRST_LAST">Display first and last name</option>
                            </select>
                        </field>
                    </div>
                    <button class="ui button fluid green" @click.prevent="sendForm">Save</button>
                </div>
            </panel-form>
        </settings-realname>
    </div>
    <div class="ui grid">
        <div class="eight wide column">
            <div class="ui {{$color}} segment">
                <h2>Logging</h2>
                <p>Enabling this module will log various actions taken by the bot to a designated channel</p>
                <settings-logging inline-template>
                    <panel-form :form="forms.logging">
                        <div slot="inputs">
                            <div class="two fields">
                                <field name="enabled" :form="forms.logging">
                                    <div class="ui slider checkbox">
                                        <input type="checkbox" name="enabled" v-model="forms.logging.enabled"/>
                                        <label>Enable</label>
                                    </div>
                                </field>
                                <field name="channel" :form="forms.logging" :class="{'disabled': !forms.logging.enabled}">
                                    <label>Logging Channel</label>
                                    <select class="ui search selection fluid dropdown" name="channel" v-model="forms.logging.channel">
                                        @foreach($textChannels as $channel)
                                            @if($channel->type == 'TEXT')
                                                <option value="{{$channel->id}}">#{{$channel->channel_name}}</option>
                                            @endif
                                        @endforeach
                                    </select>
                                </field>
                            </div>
                            <button class="ui button fluid green" @click.prevent="save">Save</button>
                        </div>
                    </panel-form>
                </settings-logging>
            </div>
        </div>
        <div class="eight wide column">
            <div class="ui {{$color}} segment">
                <h2>Bot Nickname</h2>
                <p>Entering a name here will change KirBot's name on this server. Leave blank to reset</p>
                <settings-bot-name inline-template>
                    <panel-form :form="forms.name">
                        <div slot="inputs">
                            <field name="name" :form="forms.name">
                                <label>Nickname</label>
                                <input name="name" v-model="forms.name.name"/>
                            </field>
                            <button class="ui button fluid green" @click.prevent="save">Save</button>
                        </div>
                    </panel-form>
                </settings-bot-name>
            </div>
        </div>
    </div>

    <div class="ui grid">
        <div class="eight wide column">
            <div class="ui {{$color}} segment">
                <h2>Channel Whitelist</h2>
                <settings-channel-whitelist inline-template>
                    <panel-form :form="forms.whitelist">
                        <div slot="inputs">
                            <p>Channels specified here are the only channels in which bot commands can be run. The bot will ignore
                                <b>MOST</b> commands from other channels.</p>
                            <em>Leave blank to allow all channels</em>
                            <field name="channels" :form="forms.whitelist">
                                <label><b>Channels</b></label>
                                <select class="ui fluid search dropdown" multiple="" name="channels[]" v-model="forms.whitelist.channels">
                                    @foreach($textChannels as $channel)
                                        @if($channel->type == 'TEXT')
                                            <option value="{{$channel->id}}">#{{$channel->channel_name}}</option>
                                        @endif
                                    @endforeach
                                </select>
                            </field>
                            <button class="ui button fluid green" @click.prevent="save">Save</button>
                        </div>
                    </panel-form>
                </settings-channel-whitelist>
            </div>
        </div>

        <div class="eight wide column">
            <div class="ui {{$color}} segment">
                <h2>Bot Manager Roles</h2>
                <p>Users with the following roles can access commands that are restricted to the "Bot Manager" role</p>
                <settings-bot-manager inline-template>
                    <panel-form :form="forms.roles">
                        <div slot="inputs">
                            <field name="roles" :form="forms.roles">
                                <label><b>Roles</b></label>
                                <select class="ui fluid search dropdown" multiple="" name="roles[]" v-model="forms.roles.roles">
                                    @foreach($roles as $role)
                                        <option value="{{$role->id}}">{{$role->name}}</option>
                                    @endforeach
                                </select>
                            </field>
                            <button class="ui button fluid green" @click.prevent="save">Save</button>
                        </div>
                    </panel-form>
                </settings-bot-manager>
            </div>
        </div>
    </div>

@endsection