@extends('layouts.semantic')

@section('title', 'Bot Chat')


@section('content')
    <bot-chat inline-template>
        <div>
            <div class="ui center aligned segment">
                <form class="ui form" @submit.prevent="sendMessage" :class="{'loading':loading}">
                    <div class="field">
                        <label>Select a Server</label>
                        <select class="ui search selection fluid dropdown" name="server_select" v-model="selected_server" @change="getChannels">
                            <option v-for="server in servers" :value="server.id">@{{ server.name }}</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Select a Channel</label>
                        <select class="ui search selection fluid dropdown" name="channel_select" v-model="selected_channel">
                            <option v-for="channel in channels" :value="channel.id">#@{{ channel.channel_name }}</option>
                        </select>
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