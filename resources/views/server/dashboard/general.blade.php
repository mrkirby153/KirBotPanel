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
                        <field name="requireRealname" :form="forms.realName"
                               :class="{'disabled': forms.realName.realnameSetting == 'OFF' || readonly}">
                            <div class="ui checkbox">
                                <input type="checkbox" name="requireRealname" v-model="forms.realName.requireRealname"
                                       @change="sendForm" :disabled="readonly"/>
                                <label>Require Real Names</label>
                            </div>
                            <p>If checked, users will be assigned a role if they have not set their real name</p>
                        </field>
                        <field name="realnameSetting" :form="forms.realName">
                            <label>Real Name</label>
                            <dropdown name="realName" v-model="forms.realName.realnameSetting" @change="sendForm"
                                      :disabled="readonly">
                                <option value="OFF">Disabled</option>
                                <option value="FIRST_ONLY">Display first name only</option>
                                <option value="FIRST_LAST">Display first and last name</option>
                            </dropdown>
                        </field>
                    </div>
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
                                        <input type="checkbox" name="enabled" v-model="forms.logging.enabled"
                                               @change="save" :disabled="readonly"/>
                                        <label>Enable</label>
                                    </div>
                                </field>
                                <field name="channel" :form="forms.logging"
                                       :class="{'disabled': !forms.logging.enabled}">
                                    <label>Logging Channel</label>
                                    <dropdown class="search selection" name="channel" v-model="forms.logging.channel"
                                              @change="save" :disabled="readonly">
                                        @foreach($textChannels as $channel)
                                            @if($channel->type == 'TEXT')
                                                <option value="{{$channel->id}}">#{{$channel->channel_name}}</option>
                                            @endif
                                        @endforeach
                                    </dropdown>
                                </field>
                            </div>
                            <field name="timezone" :form="forms.logging" :class="{'disabled': !forms.logging.enabled}" v-show="forms.logging.enabled">
                                <label>Log Timezone</label>
                                <p>The timezone for timestamped log messages to be shown in. Supports most timezones (i.e
                                    <code>America/Los Angeles</code>, <code>UTC</code>).</p>
                                <input type="text" name="timezone" v-model="forms.logging.timezone" :disabled="readonly"
                                       @change="save"/>
                            </field>
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
                    <panel-form :form="forms.name" @submit="save">
                        <div slot="inputs">
                            <field name="name" :form="forms.name">
                                <label>Nickname</label>
                                <input name="name" v-model="forms.name.name" @change="save" :disabled="readonly"/>
                            </field>
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
                            <p>Channels specified here are the only channels in which bot commands can be run. The bot
                                will ignore
                                <b>MOST</b> commands from other channels.</p>
                            <em>Leave blank to allow all channels</em>
                            <field name="channels" :form="forms.whitelist">
                                <label><b>Channels</b></label>
                                <dropdown class="search" multiple="" name="channels[]"
                                          v-model="forms.whitelist.channels" @change="save" :disabled="readonly">
                                    @foreach($textChannels as $channel)
                                        @if($channel->type == 'TEXT')
                                            <option value="{{$channel->id}}">#{{$channel->channel_name}}</option>
                                        @endif
                                    @endforeach
                                </dropdown>
                            </field>
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
                                <dropdown class="search" multiple="" name="roles[]" v-model="forms.roles.roles"
                                          @change="save" :disabled="readonly">
                                    @foreach($roles as $role)
                                        <option value="{{$role->id}}">{{$role->name}}</option>
                                    @endforeach
                                </dropdown>
                            </field>
                        </div>
                    </panel-form>
                </settings-bot-manager>
            </div>
        </div>
    </div>

    <div class="ui {{$color}} segment">
        <h2>User Persistence</h2>
        <p>When enabled, users' roles and nicknames will be restored when they rejoin. This does
            <b>NOT</b> affect per channel permissions</p>
        <settings-user-persistence inline-template>
            <panel-form :form="forms.persist">
                <div slot="inputs">
                    <field name="persistence" :form="forms.persist">
                        <div class="ui slider checkbox">
                            <input type="checkbox" name="enabled" v-model="forms.persist.persistence" @change="save"
                                   :disabled="readonly"/>
                            <label>Enable</label>
                        </div>
                    </field>
                </div>
            </panel-form>
        </settings-user-persistence>

    </div>
@endsection