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
                        @foreach(\App\Menu\Panel::getServerSettingsTabs() as $t)
                            <li class="nav-item">
                                <a class="nav-link text-left {{(isset($tab) && $tab == $t->name)? 'active' : ''}}"
                                   href="{{route($t->route, ['server'=>$server])}}"><i class="fas fa-{{$t->icon}} menu-icon"></i>{{$t->label}}</a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
        {{-- End Sidebar --}}

        {{-- Main Content --}}
        <div class="col-lg-10 col-md-12 pb-sm-2">
            <div class="card">
                <div class="card-header text-capitalize">
                    {{\App\Menu\Panel::getPanelByName($tab)->label}}
                </div>
                <div class="card-body">
                    @yield('panel')
                </div>
            </div>
        </div>
        {{-- End Main Content --}}
    </div>
@endsection