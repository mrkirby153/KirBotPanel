@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab)
    ?>
    <settings-channels inline-template>
        <div>
            <div class="ui {{$color}} segment">
                <h2>Voice Channels</h2>
                <table class="ui celled table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="channel in voiceChannels">
                        <td>@{{ channel.id }}</td>
                        <td>@{{ channel.channel_name }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="ui {{$color}} segment">
                <h2>Text Channels</h2>
                <table class="ui celled table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Hidden</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(channel, index) in textChannels">
                        <td>@{{ channel.id }}</td>
                        <td>@{{ channel.channel_name }}</td>
                        <td>@{{ channel.private? "Yes" : "No" }}</td>
                        <td>
                            <div class="ui buttons">
                                <button class="ui green button" v-if="channel.private" @click="channelVisibility(index, true)">Show</button>
                                <button class="ui red button" @click="channelVisibility(index, false)" v-else>Hide</button>
                                <button class="ui blue button" @click="regainAccess(index)">Regain Access</button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </settings-channels>
@endsection