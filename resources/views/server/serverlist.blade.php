@extends('layouts.master')

@section('title', 'Server select')

@section('content')
    <div class="row">
        <div class="col-lg-8 offset-lg-2">
            <h1 class="text-center text-capitalize">Select a server to manage</h1>
            <div class="row justify-content-center server-select">
                @foreach($onServers as $server)
                    @php
                        $server_icon = $server->has_icon? "https://cdn.discordapp.com/icons/".$server->id."/".$server->icon.".webp"
                        : route('serverIcon').'?server_name='.urlencode($server->name);
                    @endphp
                    <div class="server col-md-4 col-sm-6 h-100">
                        <div class="server-icon">
                            <a href="{{url('/dashboard/'.$server->id)}}" class="d-flex">
                                <img src="{{$server_icon}}" alt="{{$server->name}}" class="rounded-circle"/>
                                <span class="server-name align-middle my-auto text-center w-100">{{$server->name}}</span>
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
    <div class="row mt-1">
        <div class="col-lg-8 offset-lg-2">
            <h1 class="text-center text-capitalize">Add to your server</h1>
            <div class="row justify-content-center server-select">
                @foreach($notOnServers as $server)
                    @php
                        $server_icon = $server->has_icon? "https://cdn.discordapp.com/icons/".$server->id."/".$server->icon.".webp"
                        : route('serverIcon').'?server_name='.urlencode($server->name);
                    @endphp
                    @if($server->manager)
                        <div class="server col-md-4 col-sm-6 h-100">
                            <div class="server-icon">
                                <a href="{{url('/dashboard/'.$server->id)}}" class="d-flex">
                                    <img src="{{$server_icon}}" alt="{{$server->name}}"
                                         class="greyscale rounded-circle"/>
                                    <span class="server-name align-middle my-auto text-center w-100">{{$server->name}}</span>
                                </a>
                            </div>
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    </div>
@endsection