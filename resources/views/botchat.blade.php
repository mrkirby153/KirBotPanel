@extends('layouts.semantic')

@section('title', 'Bot Chat')


@section('content')
    <bot-chat inline-template>
        <div>
            <div class="ui center aligned segment">
                <form class="ui form" @submit.prevent="sendMessage" :class="{'loading':loading}">
                    <div class="field">
                        <label>Select a Server</label>
                        <dropdown class="search selection" name="server_select" v-model="selected_server" @change="getChannels">
                            <option v-for="server in servers" :key="server.id" :value="server.id">@{{ server.name }}</option>
                        </dropdown>
                    </div>
                    <div class="field">
                        <label>Select a Channel</label>
                        <dropdown class="search selection" name="channel_select" v-model="selected_channel">
                            <option v-for="channel in channels" :key="channel.id" :value="channel.id">#@{{ channel.channel_name }}</option>
                        </dropdown>
                    </div>
                    <div class="field">
                        <label>Message</label>
                        <textarea v-model="message"></textarea>
                    </div>
                    <button class="ui button fluid green" @click.prevent="sendMessage">Send</button>
                </form>
            </div>
        </div>
    </bot-chat>
@endsection