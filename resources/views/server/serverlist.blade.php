@extends('layouts.semantic')

@section('title', 'Select a Server')

@section('content')
    <h1>Please select a server to manage</h1>
    <div class="ui cards">
        @foreach($servers as $server)
            <?php
                $url = $server->on? url('/dashboard/'.$server->id) : 'https://discordapp.com/oauth2/authorize?client_id=261292113046667276&scope=bot&permissions=8&guild_id='.$server->id;
                ?>
            <div class="ui card">
                @if($server->has_icon)
                    <a class="image" href="{{$url}}">
                        <img src="https://cdn.discordapp.com/icons/{{$server->id}}/{{$server->icon}}.webp"/>
                    </a>
                @endif
                <div class="content">
                    <a class="header" href="{{$url}}">{{$server->name}}</a>
                </div>
            </div>
        @endforeach
    </div>
@endsection