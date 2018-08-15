@extends('layouts.master')

@section('title', 'Music Queue - '.$server->name)

@section('content')
    <music-queue inline-template discrim="{{$server->command_discriminator}}" server="{{$server->id}}">
        <div class="row justify-content-center mt-2">
            <div class="col-8">
                <div class="card">
                    <div class="card-header">Music Queue - {{$server->name}}</div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12" v-if="nowPlaying">
                                <h2>Now Playing</h2>
                                <img :src="getYoutubeThumbnail(nowPlaying.url)" class="music-queue-image"/>
                                <span class="music-queue-text"> @{{ nowPlaying.title }}</span>
                                <div class="progress mt-2">
                                    <div class="progress-bar" :style="{'width': (nowPlaying.position / nowPlaying.duration)*100 + '%'}"></div>
                                </div>@{{ formatTime(nowPlaying.position) }}/@{{ formatTime(nowPlaying.duration) }}
                            </div>
                            <div class="col-12" v-else>
                                <h2>Nothing is playing</h2>
                                Queue songs by typing <code>@{{ discrim }}play [Song Title/URL]</code>
                            </div>
                        </div>
                        <hr v-if="nowPlaying"/>
                        <div class="row" v-if="nowPlaying">
                            <div class="col-12">
                                <h2>Up Next (@{{ queueLength }})</h2>
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                        <tr class="thead-light">
                                            <th>Title</th>
                                            <th>Duration</th>
                                            <th>Requested By</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-if="queue.length < 1" class="text-center">
                                            <td colspan="4">Nothing is up next! Queue songs by typing <code>@{{ discrim
                                                    }}play [Song Title/URL]</code></td>
                                        </tr>
                                        <transition-group name="fade">
                                            <tr v-for="song in queue" :key="song.url">
                                                <td><a :href="song.url" target="_blank">@{{ song.title }}</a></td>
                                                <td>@{{ formatTime(song.duration) }}</td>
                                                <td>@{{ song.queued_by }}</td>
                                            </tr>
                                        </transition-group>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </music-queue>

@endsection