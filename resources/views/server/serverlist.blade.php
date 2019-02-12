@extends('layouts.master')

@section('title', 'Server select')

@section('content')
        <div class="row">
            <div class="col-lg-8 offset-lg-2">

                <h1 class="text-center text-capitalize">Select a server to manage</h1>
                <div class="row server-select">
                    @foreach($servers as $server)
                        @php
                            $server_icon = $server->icon_id != null? "https://cdn.discordapp.com/icons/".$server->id."/".$server->icon_id.".png"
                            : route('serverIcon').'?server_name='.urlencode($server->name);
                        @endphp
                        <div class="server col-md-4 col-sm-6 h-100">
                            <div class="server-icon">
                                <a href="{{url('/dashboard/'.$server->id)}}" class="d-flex">
                                    <img src="{{$server_icon}}" alt="{{$server->name}}" class="rounded-circle"/>
                                    <span class="server-name align-middle my-auto text-center">{{$server->name}}</span>
                                </a>
                            </div>
                        </div>
                    @endforeach
                    <div class="server add-bot">
                        <div class="server-icon">
                            <a href="https://discordapp.com/oauth2/authorize?client_id=261292113046667276&permissions=485878983&scope=bot" target="_blank" class="d-flex">
                                <div class="plus-icon">
                                    <i class="fas fa-plus plus-inner"></i>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
@endsection