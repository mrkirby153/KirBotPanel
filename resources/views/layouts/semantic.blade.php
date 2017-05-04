@extends('layouts.semantic_base')

@section('body')
    <div class="ui container">
        <div class="ui grid">
            <div class="row">
                <div class="column">
                    <h1 class="ui header centered">@yield('title')</h1>
                    <div class="ui divider"></div>
                    @yield('content')
                </div>
            </div>
        </div>
    </div>
@endsection