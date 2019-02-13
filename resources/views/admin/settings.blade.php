@extends('layouts.master')

@section('title', 'Manage Settings')


@section('content')
    <div class="row justify-content-center mt-2">
        <div class="col-8">
            <div class="card">
                <div class="card-header">
                    Admin
                </div>
                <admin-settings inline-template>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="server-select"><b>Server</b></label>
                            <select id="server-select" class="form-control" v-model="selected">
                                <option :value="null" selected disabled>Select a server</option>
                                <option v-for="guild in guilds" :key="guild.id" :value="guild.id">@{{ guild.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="property"><b>Settings</b></label>
                            <select id="property" class="form-control" :disabled="settings.length <= 0" @change="updateKey($event)">
                                <option :value="null" selected disabled>Select a property</option>
                                <option v-for="setting in settings" :key="setting.key" :value="setting.key">@{{
                                    setting.key }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="key"><b>Key</b></label>
                            <input type="text" class="form-control" placeholder="Key" v-model="property_name"/>
                        </div>
                        <div class="form-group">
                            <label for="value"><b>Value</b></label>
                            <textarea class="form-control" v-model="property_value"></textarea>                            {{--<input type="text" class="form-control" placeholder="Value" v-model="property_value"/>--}}
                        </div>
                        <input type="button" class="btn btn-success" value="Save" @click.prevent="update"/>
                        <input type="button" class="btn btn-danger" value="Delete" @click.prevent="del"/>
                    </div>
                </admin-settings>
            </div>
        </div>
    </div>
@endsection