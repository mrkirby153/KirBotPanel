@extends('layouts.semantic_base')

@section('title', '503: Temporarily Unavailable')
@section('body')
    <div class="ui container">
        <div class="ui grid">
            <div class="row">
                <div class="column">
                    <div class="ui padded center segment">
                        <h2>503 - Temporarily Unavailable</h2>
                        <p>The requested resource is temporarily unavailable. Please try again in a few minutes</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection