@extends('layouts.semantic_base')

@section('body')
    <div class="ui container">
        <div class="ui grid">
            <div class="row">
                <div class="column">
                    @yield('content')
                </div>
            </div>
        </div>
    </div>
@endsection