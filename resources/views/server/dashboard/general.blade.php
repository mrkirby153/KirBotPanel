@extends('layouts.dashboard')

@section('body')
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
                    <select name="real_name_setting" id="real_name_setting" v-model="forms.realName.realnameSetting">
                        <option value="OFF">Disabled</option>
                        <option value="FIRST_ONLY">Display first name only</option>
                        <option value="FIRST_LAST">Display first and last name</option>
                    </select>
                </div>
            </div>
            <button class="ui button fluid green" @click.prevent="sendForm">Save</button>
        </form>
    </settings-realname>
@endsection