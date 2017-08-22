@extends('layouts.semantic_base')

@section('title', '500: Unknown Error')
@section('body')
    <div class="ui container">
        <div class="ui grid">
            <div class="row">
                <div class="column">
                    <div class="ui padded center segment">
                        <h2>500 - That's an error</h2>
                        <p>An unknown error occurred, please try again later.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection