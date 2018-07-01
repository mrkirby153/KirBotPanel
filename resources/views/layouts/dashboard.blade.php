@extends('layouts.master')

@section('title', $server->name)

@section('content')
    <div class="row mt-5">
        <div class="col-md-6 offset-md-3 offset-sm-1 col-sm-10">
            <div class="row">
                <div class="col-lg-3 col-md-12">
                    <div class="server-sidebar mb-3 pb-2">
                        <div class="d-flex flex-column justify-content-center">
                            <img class="m-auto server-image" src="{{$server->getIcon()}}"/>
                            <span class="text-center mt-2">{{$server->name}}</span>
                        </div>
                    </div>
                    <ul class="nav flex-column nav-pills nav-fill dashboard-sidebar">
                        {{-- TODO: Replace this with the actual links --}}
                        <li class="nav-item">
                            <a class="nav-link active text-left" href="#">General</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-left" href="#">General</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-left" href="#">General</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-left" href="#">General</a>
                        </li>
                    </ul>
                </div>
                <div class="col-md-9">
                    @yield('panel')
                </div>
            </div>
        </div>
    </div>
@endsection