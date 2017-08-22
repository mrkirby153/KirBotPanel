@extends('layouts.semantic_base')

@section('title', '404: Not Found')
@section('body')
    <div class="ui container">
        <div class="ui grid">
            <div class="row">
                <div class="column">
                    <div class="ui padded center segment">
                        <h2>404 - Not Found</h2>
                        <p>The resource you requested could not be found. Double check the URL and try again</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection