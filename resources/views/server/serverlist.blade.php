@extends('layouts.semantic')

@section('title', 'Select a Server')

@section('content')
    <h1>Please select a server to manage</h1>
    <div class="ui cards">
        @foreach($servers as $server)
            <?php
            $url = $server->on ? url('/dashboard/' . $server->id) : 'https://discordapp.com/oauth2/authorize?client_id=' . env('DISCORD_KEY') . '&scope=bot&permissions=8&guild_id=' . $server->id;
            ?>
            @if(\App\Utils\PermissionHandler::canView(Auth::user(), $server->id))
                <div class="ui card">
                    <a class="image" href="{{$url}}">
                        @if($server->has_icon)
                            <img src="https://cdn.discordapp.com/icons/{{$server->id}}/{{$server->icon}}.webp"/>
                        @else
                            <img src="{{route('serverIcon')}}?server_name={{urlencode($server->name)}}"/>
                        @endif
                    </a>
                    <div class="content">
                        <a class="header" href="{{$url}}">{{$server->name}}</a>
                    </div>
                </div>
            @endif
        @endforeach
    </div>
@endsection