@extends('layouts.semantic')

@section('title', 'Select a Server')

@section('content')
    <div class="ui cards">
        @foreach($servers as $server)
            <div class="ui card">
                @if($server->has_icon)
                    <a class="image" href="{{url('/dashboard/'.$server->id)}}">
                        <img src="https://cdn.discordapp.com/icons/{{$server->id}}/{{$server->icon}}.webp"/>
                    </a>
                @endif
                <div class="content">
                    <a class="header" href="{{url('/dashboard/'.$server->id)}}">{{$server->name}}</a>
                </div>
            </div>
        @endforeach
    </div>
@endsection