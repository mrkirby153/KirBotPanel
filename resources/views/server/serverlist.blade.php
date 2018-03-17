@extends('layouts.semantic')

@section('title', 'Select a Server')

@section('content')
    @if(sizeof($onServers) > 0)
        <h1>Please select a server to manage</h1>
        <div class="server-select">
            <div class="ui cards">
                @foreach($onServers as $server)
                    @if(\App\Utils\PermissionHandler::canView(Auth::user(), $server->id))
                        <div class="ui image card" style="height: 290px">
                            <a class="image" href="{{url('/dashboard/'.$server->id)}}">
                                <div class="image-background"></div>
                                @if($server->has_icon)
                                    <img src="https://cdn.discordapp.com/icons/{{$server->id}}/{{$server->icon}}.webp"/>
                                @else
                                    <img src="{{route('serverIcon')}}?server_name={{urlencode($server->name)}}"/>
                                @endif
                                <a class="server-name" href="{{url('/dashboard/'.$server->id)}}">{{$server->name}}</a>
                            </a>
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    @endif
    @if(sizeof($notOnServers) > 0)
        <h2>Add KirBot to your server</h2>
        <div class="ui relaxed list">
            @foreach($notOnServers as $server)
                @if($server->manager)
                    <div class="item">
                        <a href="https://discordapp.com/oauth2/authorize?client_id={{env('DISCORD_KEY')}}&scope=bot&permissions=8&guild_id={{$server->id}}}">{{$server->name}}</a>
                    </div>
                @endif
            @endforeach
        </div>
    @endif
@endsection