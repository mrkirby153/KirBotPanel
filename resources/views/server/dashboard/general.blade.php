@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab)
    ?>
    <div class="ui grid">
        <div class="sixteen wide column">
            <div class="ui {{$color}} fluid segment">
                <h2>Real Name Settings</h2>
                <settings-realname inline-template>
                    <panel-form :form="forms.realName">
                        <div slot="inputs">
                            <div class="two fields">
                                <field name="requireRealname" :form="forms.realName"
                                       :class="{'disabled': forms.realName.realnameSetting == 'OFF' || readonly}">
                                    <div class="ui checkbox">
                                        <input type="checkbox" name="requireRealname"
                                               v-model="forms.realName.requireRealname"
                                               @change="sendForm" :disabled="readonly"/>
                                        <label>Require Real Names</label>
                                    </div>
                                    <p>If checked, users will be assigned a role if they have not set their real
                                        name</p>
                                </field>
                                <field name="realnameSetting" :form="forms.realName">
                                    <label>Real Name</label>
                                    <dropdown name="realName" v-model="forms.realName.realnameSetting"
                                              @change="sendForm"
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
        </div>

        <div class="sixteen wide column">
            <div class="ui {{$color}} segment">
                <h2>Logging</h2>
                <p>
                    <b>Include:</b> A list of events to include in the log. <i>Leave blank to include all events</i><br/>
                    <b>Exclude:</b> A list of events to exclude from the log channel. <i>Leave blank to exclude nothing</i>
                </p>
                <settings-logging inline-template>
                    <div>
                        <div v-for="setting in settings">
                            <b>#@{{ setting.channel.channel_name }}</b> <i class="x icon" style="cursor: pointer;" @click="deleteSettings(setting.id)"></i>
                            <div class="ui fluid labeled action input" style="margin-bottom: 10px;">
                                <div class="ui label">Include</div>
                                <dropdown class="search" multiple="multiple" v-model="setting.included" @change="updateSettings(setting.id)">
                                    <option v-for="(v, k) in logOptions" :k="k" :value="v">@{{ k }}</option>
                                </dropdown>
                            </div>
                            <div class="ui fluid labeled action input" style="margin-bottom: 10px;">
                                <div class="ui label">Exclude</div>
                                <dropdown class="search" multiple="multiple" v-model="setting.excluded" @change="updateSettings(setting.id)">
                                    <option v-for="(v, k) in logOptions" :k="k" :value="v">@{{ k }}</option>
                                </dropdown>
                            </div>
                            <hr/>
                        </div>
                        <dropdown class="search" v-model="selectedChan" @change="onChange"
                                  :disabled="readonly || channels.length === 0" prompt="Select a channel to add">
                            <option v-for="channel in channels" :key="channel.id" :value="channel.id">
                                #@{{channel.channel_name}}
                            </option>
                        </dropdown>
                    </div>
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

        <div class="sixteen wide column">
            <div class="ui {{$color}} segment">
                <h2>User Persistence</h2>
                <p>When enabled, users' roles and nicknames will be restored when they rejoin. This does
                    <b>NOT</b> affect per channel permissions</p>
                <settings-user-persistence inline-template>
                    <panel-form :form="forms.persist">
                        <div slot="inputs">
                            <field name="persistence" :form="forms.persist">
                                <div class="ui slider checkbox">
                                    <input type="checkbox" name="enabled" v-model="forms.persist.persistence"
                                           @change="save"
                                           :disabled="readonly"/>
                                    <label>Enable</label>
                                </div>
                            </field>
                        </div>
                    </panel-form>
                </settings-user-persistence>

            </div>
        </div>
    </div>
@endsection