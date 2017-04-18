@extends('layouts.semantic')

@section('title', 'User Information')


@section('content')
    <user-information inline-template>
        <div>
            <form class="ui form" :class="{'loading': forms.userData.busy, 'success':forms.userData.successful, 'error': forms.userData.errors.hasErrors()}">
                <div class="ui success message">
                    <div class="header">Success!</div>
                    <p>Your name has been updated!</p>
                </div>
                <div class="ui error message">
                    <div class="header">The following errors were found:</div>
                    <ul>
                        <li v-for="error in forms.userData.errors.flatten()">
                            @{{ error }}
                        </li>
                    </ul>
                </div>
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
        {{-- <div class="ui form">
             <div class="ui error message">
                 <div class="header">Errors:</div>
                 <ul>
                     <li v-for="error in forms.userData.errors.flatten()">
                         @{{ error }}
                     </li>
                 </ul>
             </div>
             <div class="ui success message" v-if="forms.userData.successful">
                 <div class="header">Success</div>
                 Your name has been updated!
             </div>
             <form :class="{'loading':forms.userData.busy, 'success':forms.userData.successful}" id="name">
                 <div class="two fields">
                     <div class="field" :class="{'error':forms.userData.errors.has('firstname')}">
                         <label>First Name</label>
                         <input type="text" name="first_name" id="first_name" placeholder="First Name" v-model="forms.userData.firstname"/>
                     </div>
                     <div class="field" :class="{'error':forms.userData.errors.has('lastname')}">
                         <label>Last Name</label>
                         <input type="text" name="last_name" id="last_name" placeholder="Last Name" v-model="forms.userData.lastname"/>
                     </div>
                 </div>
                 <button class="ui fluid green button" id="save" :disabled="forms.userData.busy" @click.prevent="updateProfile">
                     Save
                 </button>
             </form>
         </div>
     </div>--}}
    </user-information>
@endsection