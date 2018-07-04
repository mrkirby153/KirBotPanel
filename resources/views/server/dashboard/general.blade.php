@extends('layouts.dashboard')

@section('panel')
    <h2>Real Name Settings</h2>
    <div class="row">
        <div class="col-md-6 col-sm-12">
            <div class="d-flex h-100 align-items-center">
                <input-switch label="Require Real Names"></input-switch>
            </div>

        </div>
        <div class="col-md-6 col-sm-12">
            <div class="form-group">
                <label for="realname-settings"><b>Realname Settings</b></label>
                <select class="form-control" id="realname-settings">
                    <option disabled selected>Select an option...</option>
                    <option value="OFF">Disabled</option>
                    <option value="FIRST_ONLY">Display first name only</option>
                    <option value="FIRST_LAST">Display first and last name</option>
                </select>
            </div>
        </div>
    </div>
    <hr/>
    <h2>Logging</h2>
    <div class="row">
        <div class="col-12">
            <p>
                <b>Include:</b> A list of all events that are included in the log. <i>Leave blank to include all
                    events</i> <br/>
                <b>Exclude:</b> A list of events that are excluded from the channel <i>Leave blank to exclude
                    nothing</i>
            </p>
            <div class="form-group">
                <label for="channelAdd"><b>Add a channel</b></label>
                <select class="form-control" name="channelAdd" id="channelAdd">
                    <option selected disabled>Add a channel...</option>
                    <option value="1">A</option>
                    <option value="1">B</option>
                    <option value="1">C</option>
                </select>
            </div>
            <div class="log-channels">
                <div class="log-channel">
                    <span class="channel-name">test</span>
                    <div class="included">
                        <code>USER_KICK, USER_BAN, USER_MUTE, USER_UNMUTE</code>
                    </div>
                    <div class="excluded">
                        <code>MESSAGE_EDIT</code>
                    </div>
                    <div class="btn-group mt-2">
                        <button class="btn btn-info"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-danger"><i class="fas fa-times"></i> Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr/>
    <div class="row">
        <div class="col-6">
            <settings-bot-name inline-template>
                <div>
                    <h2>Bot Nickname</h2>
                    <panel-form :form="forms.name" @submit="save">
                        <field name="name" :form="forms.name" :class="{'is-valid': forms.name.successful}">
                            <input type="text" class="form-control" v-model="forms.name.name" @change="save"/>
                            <span slot="valid-feedback">Name has been updated!</span>
                        </field>
                    </panel-form>
                </div>
            </settings-bot-name>
        </div>
        <div class="col-6">
            <h2>Channel Whitelist</h2>
        </div>
    </div>

@endsection