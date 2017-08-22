@extends('layouts.semantic')

@section('title', 'User Information')


@section('content')
    <user-information inline-template>
        <div>
            <div class="ui purple message" v-if="!disabled">
                <div class="header">Why are you here?</div>
                <p>
                    If you're here, chances are it's because @if(empty($server)) A Discord Server @else
                        <b>{{$server}}</b> @endif is running KirBot with real name settings enabled. When you enter your
                    name here, your nickname will be set to your real name. This may take up to a minute.
                </p>
                <p>
                    <b>WARNING:</b> Once you set your name, it <i>CANNOT</i> be changed.
                </p>
            </div>
            <div class="ui message warning" v-else>
                <div class="header">You have already set your name!</div>
                <p>
                    You have already set your real name.
                </p>
                <div class="ui compact animated fade button" tabindex="0" @click="activateForm" v-if="!alreadyChanged">
                    <div class="visible content">Click here if you made a mistake</div>
                    <div class="hidden content">Change your Name</div>
                </div>
            </div>
            @if(!Auth::guest())
                <panel-form :form="forms.userData">
                    <p slot="successHeader">Success!</p>
                    <p slot="success">Your name has been updated</p>
                    <div slot="inputs">
                        <div class="two fields">
                            <field name="firstname" :form="forms.userData">
                                <label>First Name</label>
                                <input name="firstname" id="firstname" v-model="forms.userData.firstname" :readonly="disabled? '' : null"/>
                            </field>
                            <field name="lastname" :form="forms.userData">
                                <label>Last Name</label>
                                <input name="lastname" id="lastname" v-model="forms.userData.lastname" :readonly="disabled? '' : null"/>
                            </field>
                        </div>
                        <button class="ui fluid button green" @click.prevent="updateProfile" :class="{'disabled': disabled}">Save</button>
                    </div>
                </panel-form>
            @else
                <a href="{{url('/login?returnUrl=/name'.(($serverId != null)? '?serverId='.$serverId : ''))}}" class="ui fluid button purple">Log In With Discord</a>
            @endif
            <div class="ui basic modal" id="confirm-set-name">
                <div class="ui icon header">
                    <i class="warning icon"></i>
                    Confirm Name
                </div>
                <div class="content">
                    <p>Is the name <b>@{{forms.userData.firstname +" "+forms.userData.lastname}}</b> correct?</p>
                </div>
                <div class="actions">
                    <div class="ui green ok inverted button"><i class="checkmark icon"></i>Yes</div>
                    <div class="ui basic red cancel inverted button"><i class="remove icon"></i> No</div>
                </div>
            </div>
            <div class="ui basic modal" id="missing-name">
                <div class="ui icon header">
                    <i class="ui remove icon"></i>
                    Error
                </div>
                <div class="content">
                    <p>You must specify both a first name and a last name!</p>
                </div>
                <div class="actions">
                    <div class="ui green ok inverted button">Ok</div>
                </div>
            </div>
            <div class="ui basic modal" id="confirm-reactivate">
                <div class="ui icon header">
                    <i class="warning icon"></i>
                    Change Name
                </div>
                <div class="content">
                    <p>Are you sure you want to change your name?</p>
                </div>
                <div class="actions">
                    <div class="ui green ok inverted right labeled icon button">
                        <i class="checkmark icon"></i>
                        Yes
                    </div>
                    <div class="ui red basic cancel inverted right labeled icon button">
                        <i class="remove icon"></i>
                        No
                    </div>
                </div>
            </div>
        </div>
    </user-information>
@endsection