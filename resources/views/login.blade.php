@extends('layouts.master')

@section('title', 'Log In')

@section('content')
    <div class="container login-page">
        <div class="row align-items-center mt-5">
            <div class="col-md-4 mx-auto">
                <div class="card">
                    <div class="card-header">
                        Log In With Discord
                    </div>
                    <div class="card-body">
                        @php
                            $returnUrl = urlencode(Request::get('returnUrl', '/'));
                            $withGuilds = Request::get('requireGuilds', 'false');
                        @endphp
                        <a href="{{route('login.do')}}?returnUrl={{$returnUrl}}&requireGuilds={{$withGuilds}}">
                            <img src="https://discordapp.com/assets/bb408e0343ddedc0967f246f7e89cebf.svg"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection