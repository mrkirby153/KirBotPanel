@extends('layouts.semantic')

@section('title', 'User Information')


@section('content')
    <user-information inline-template>
        <div>
            <form class="ui form" :class="{'loading': forms.userData.busy, 'success':forms.userData.successful, 'error': forms.userData.errors.hasErrors()}">
                <form-messages success-header="Success!" success-body="Your name has been updated!" :error-array="forms.userData.errors.flatten()"></form-messages>
                <div class="two fields">
                    <div class="field" :class="{'error':forms.userData.errors.has('firstname')}">
                        <label>First Name</label>
                        <input type="text" name="firstname" id="firstname" v-model="forms.userData.firstname"/>
                    </div>
                    <div class="field" :class="{'error':forms.userData.errors.has('lastname')}">
                        <label>Last Name</label>
                        <input type="text" name="lastname" id="lastname" v-model="forms.userData.lastname"/>
                    </div>
                </div>
                <button class="ui fluid button green" @click.prevent="updateProfile">Save</button>
            </form>
        </div>
    </user-information>
@endsection