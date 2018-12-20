@extends('layouts.dashboard')

@section('panel')
    <h2>Real Name Settings</h2>
    <settings-realname inline-template>
        <div class="row">
            <div class="col-md-6 col-sm-12">
                <div class="d-flex h-100 align-items-center">
                    <input-switch label="Require Real Names"
                            :disabled="readonly || forms.realName.realnameSetting == 'OFF'"
                            v-model="forms.realName.requireRealname" @change="sendForm"></input-switch>
                </div>
            </div>
            <div class="col-md-6 col-sm-12">
                <div class="form-group">
                    <label for="realname-settings"><b>Realname Settings</b></label>
                    <select class="form-control" id="realname-settings" v-model="forms.realName.realnameSetting"
                            :disabled="readonly"
                            @change="sendForm">
                        <option disabled selected>Select an option...</option>
                        <option value="OFF">Disabled</option>
                        <option value="FIRST_ONLY">Display first name only</option>
                        <option value="FIRST_LAST">Display first and last name</option>
                    </select>
                </div>
            </div>
        </div>
    </settings-realname>
    <hr/>
    <h2>Logging</h2>
    <settings-logging inline-template>
        <div class="row">
            <div class="col-12">
                <p>
                    <b>Include:</b> A list of all events that are included in the log. <i>Leave blank to include all
                        events</i> <br/>
                    <b>Exclude:</b> A list of events that are excluded from the channel <i>Leave blank to exclude
                        nothing</i>
                </p>
                <div class="form-row">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="channelAdd"><b>Add a channel</b></label>
                            <select class="form-control" name="channelAdd" id="channelAdd" v-model="selectedChan"
                                    @change="onChange" :disabled="readonly || communicationError">
                                <option selected disabled value="">Add a channel...</option>
                                <option v-for="channel in channels" :key="channel.id" :value="channel.id">
                                    #@{{channel.channel_name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-6">
                        <panel-form :form="forms.logTimezone" @submit="updateTimezone">
                            <field name="timezone" :form="forms.logTimezone" show-success="true">
                                <label for="timezone"><b>Log Timezone</b></label>
                                <input type="text" class="form-control" id="timezone"
                                        v-model="forms.logTimezone.timezone" @change="updateTimezone" :readonly="readonly"/>
                                <span slot="valid-feedback">Timezone has been updated</span>
                            </field>
                        </panel-form>
                    </div>
                </div>

                <div class="log-channels">
                    <transition-group name="fade">
                        <div class="log-channel" v-for="chan in settings" :key="chan.id" v-if="!communicationError">
                            <span class="channel-name">@{{ chan.channel.channel_name }}</span>
                            <div class="included">
                                <code>@{{ localizeEvents(chan.included, 'All Events') }}</code>
                            </div>
                            <div class="excluded">
                                <code>@{{ localizeEvents(chan.excluded, 'No Events') }}</code>
                            </div>
                            <div class="btn-group mt-2">
                                <button class="btn btn-info" @click="showEditModal(chan.id)" :disabled="readonly">
                                    <i class="fas fa-edit"></i>
                                    Edit
                                </button>
                                <button class="btn btn-danger" @click="confirmDelete(chan.id)" :disabled="readonly">
                                    <i class="fas fa-times"></i> <span v-if="isConfirming(chan.id)">Confirm?</span><span
                                            v-else>Delete</span>
                                </button>
                            </div>
                        </div>
                    </transition-group>
                    <transition name="scale">
                        <div class="alert alert-danger" v-if="communicationError">
                            <h2 class="alert-heading">Communication Error</h2>
                            <p>There was an error communicating with the bot to retrieve log settings. Your current
                                settings have not been changed.</p>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="modal fade" tabindex="-1" role="dialog" id="logSettingModal">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit #@{{ editing.name }}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="btn-group">
                                <button class="btn btn-primary" :class="{'active': editing.mode=='include'}"
                                        @click="editing.mode='include'">Include
                                </button>
                                <button class="btn btn-primary" :class="{'active': editing.mode=='exclude'}"
                                        @click="editing.mode='exclude'">Exclude
                                </button>
                            </div>
                            <p class="mt-1">
                                Below are log events that can be @{{ editing.mode }}ded from the log channel. Leave
                                blank to
                                <span v-if="editing.mode==='include'">include all events</span><span v-else>exclude no events</span>
                            </p>
                            <div class="btn-group btn-group-sm">
                                <button class="btn btn-secondary" @click="select('all')">Select All</button>
                                <button class="btn btn-secondary" @click="select('none')">Select None</button>
                                <button class="btn btn-secondary" @click="select('invert')">Invert</button>
                            </div>
                            <div class="custom-control custom-checkbox" v-for="option in Object.keys(logOptions)"
                                    :key="option">
                                <input type="checkbox" class="custom-control-input" :id="'include_'+logOptions[option]"
                                        v-model="editing[editing.mode][option]"/>
                                <label class="custom-control-label"
                                        :for="'include_'+logOptions[option]">@{{option}}</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" @click="saveEditSettings">Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </settings-logging>
    <hr/>
    <div class="row">
        <div class="col-lg-6 col-md-12">
            <settings-bot-name inline-template>
                <div>
                    <h2>Bot Nickname</h2>
                    <panel-form :form="forms.name" @submit="save">
                        <field name="name" :form="forms.name" :class="{'is-valid': forms.name.successful}">
                            <input type="text" class="form-control" v-model="forms.name.name" @change="save"
                                    :disabled="readonly"/>
                            <span slot="valid-feedback">Name has been updated!</span>
                        </field>
                    </panel-form>
                </div>
            </settings-bot-name>
        </div>
        <settings-muted inline-template>
            <div class="col-lg-6 col-md-12">
                <h2>Muted Role</h2>
                <p>
                    Select the role that will be applied to the user when they are muted
                </p>
                <panel-form :form="forms.muted">
                    <field :form="forms.muted" name="muted_role" show-success="true">
                        <select class="form-control" v-model="forms.muted.muted_role" @change="save" :disabled="readonly">
                            <option value="">None</option>
                            @foreach($roles as $role)
                                <option value="{{$role->id}}">{{$role->name}}</option>
                            @endforeach
                        </select>
                        <span slot="valid-feedback">Muted role updated!</span>
                    </field>
                </panel-form>

            </div>
        </settings-muted>
    </div>
    <hr/>

    <settings-user-persistence inline-template>
        <div class="row">
            <div class="col-lg-6 col-md-12">
                <h2>User Persistence</h2>
                <p>
                    When enabled, users' roles and nicknames will be restored when they rejoin. This does <b>NOT</b>
                    affect
                    per channel overrides
                </p>
                <input-switch label="Enable Persistence" v-model="options.enabled"
                        @change="save" :disabled="readonly"></input-switch>
            </div>
            <div class="col-lg-6">
                <transition name="fade">
                    <div class="form-group" v-if="options.enabled">
                        <select class="form-control" @change="addRole" v-model="selected" :disabled="readonly">
                            <option value="" disabled selected>Select a role</option>
                            <option v-for="role in availableRoles" :key="role.id" :value="role.id">@{{ role.name }}
                            </option>
                        </select>
                    </div>
                </transition>
                <p>
                    The following roles are persistent roles. These roles will be restored to the user when they
                    re-join.
                    <em>If none are selected, all roles will persist</em>
                </p>
                <div class="roles">
                    <div class="role" v-if="options.enabled && (!localizedRoles || localizedRoles.length < 1)">All
                        Roles
                    </div>
                    <div class="role" v-if="!options.enabled"><em>Persistence is disabled.</em></div>
                    <div class="role" v-for="role in localizedRoles" :key="role.id">@{{ role.name }} <span
                                @click="removeRole(role.id)" v-if="options.enabled && !readonly"><i
                                    class="fas fa-times x-icon"></i></span></div>
                </div>
                <transition name="fade">
                    <div v-if="options.enabled" class="role-options">
                        <input-switch label="Persist Mute" class="switch-sm" v-model="options.mute"
                                @change="save" :disabled="readonly"></input-switch>
                        <input-switch label="Persist Roles" class="switch-sm" v-model="options.roles"
                                @change="save" :disabled="readonly"></input-switch>
                        <input-switch label="Persist Deafen" class="switch-sm" v-model="options.deafen"
                                @change="save" :disabled="readonly"></input-switch>
                        <input-switch label="Persist Nickanme" class="switch-sm" v-model="options.nick"
                                @change="save" :disabled="readonly"></input-switch>
                    </div>
                </transition>
            </div>
        </div>
    </settings-user-persistence>
    <hr/>
    <settings-channel-whitelist inline-template>
        <div class="row">
            <div class="col-12">
                <h2>Channel Whitelist</h2>
                <p>
                    Channels specified here are the only channels that bot commands can be run. The bot will ignore most
                    commands in any other channels.
                </p>
            </div>
            <div class="col-6 ">
                <transition-group name="scale-fast" class="channel-whitelist" mode="out-in">
                    <div class="channel" v-for="channel in channels" :key="channel.id">
                        #@{{ channel.channel_name }} <span class="x-icon" @click="removeChannel(channel.id)"
                                v-if="!readonly"><i
                                    class="fas fa-times"></i></span>
                    </div>
                </transition-group>
            </div>
            <div class="col-6">
                <select class="form-control" v-model="chanAdd" @change="addChannel" :disabled="readonly">
                    <option disabled selected value="">Add a channel</option>
                    <option v-for="chan in availableChannels" :key="chan.id" :value="chan.id">#@{{ chan.channel_name
                        }}
                    </option>
                </select>
            </div>
        </div>
    </settings-channel-whitelist>
    <hr/>
    <settings-starboard inline-template>
        <div class="row">
            <div class="col-12">
                <h2>Starboard</h2>
                <p>
                    If the starboard is enabled, reacting via &#x1f5e8; will no longer create new quotes
                </p>
                <input-switch label="Enable Starboard" v-model="forms.starboard.enabled" @change="save()"></input-switch>
                <div class="form-group">
                    <label>Starboard Channel</label>
                    <select class="form-control" v-model="forms.starboard.channel_id" @change="save()">
                        <option disabled selected value="">Select a channel</option>
                        @foreach($textChannels as $channel)
                            <option value="{{$channel->id}}">#{{$channel->channel_name}}</option>
                        @endforeach
                    </select>
                </div>
            </div>
            <div class="col-4">
                <div class="form-group">
                    <label>Star Count</label>
                    <input type="number" min="0" class="form-control" v-model="forms.starboard.star_count" @change="save()"/>
                </div>
            </div>
            <div class="col-4">
                <div class="form-group">
                    <label>Gild Count</label>
                    <input type="number" min="0" class="form-control" v-model="forms.starboard.gild_count" @change="save()"/>
                </div>
            </div>
            <div class="col-4">
                <input-switch label="Self Star" v-model="forms.starboard.self_star" @change="save()"></input-switch>
                <p>
                    If self-staring is enabled, users can star their own messages
                </p>
            </div>
        </div>
    </settings-starboard>

@endsection