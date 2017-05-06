@extends('layouts.semantic')

@section('title', $server->name)

@section('content')
    <div class="ui secondary pointing labeled icon menu">
        @foreach(\App\Menu\Panel::getServerSettingsTabs() as $t)
            <a href="@if($t instanceof \App\Menu\ServerDashboardSettingsTab) {{route($t->route, ['id'=>$server->id])}} @else {{route($t->route)}} @endif"
                    class="@isset($tab) {{$tab == $t->name? 'active' : ''}} @endisset @if($t instanceof \App\Menu\ServerDashboardSettingsTab) {{$t->color}} @endif item"><i class="{{$t->icon}} icon"></i> {{$t->label}}
            </a>
        @endforeach
    </div>
    @yield('panel')
@endsection