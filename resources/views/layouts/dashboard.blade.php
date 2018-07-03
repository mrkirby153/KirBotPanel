@extends('layouts.master')

@section('title', $server->name)

@section('content')
    <div class="row mt-2">
        {{-- Sidebar --}}
        <div class="col-lg-2 col-md-12">
            <div class="mb-3 pb-2 card">
                <div class="card-header">
                    {{$server->name}}
                </div>
                <div class="card-body d-flex flex-column">
                    <img class="m-auto server-image" src="{{$server->getIcon()}}">
                    <ul class="nav nav-pills nav-fill flex-column mt-3 dashboard-sidebar">
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
            </div>
        </div>
        {{-- End Sidebar --}}

        {{-- Main Content --}}
        <div class="col-lg-10 col-md-12 pb-sm-2">
            <div class="card">
                <div class="card-header">
                    General
                </div>
                <div class="card-body">
                    @yield('panel')
                </div>
            </div>
        </div>
        {{-- End Main Content --}}
    </div>
@endsection