@extends('layouts.master')

@section('title', 'Quotes - '.$server->name)
@php
    $parsedown = new Parsedown();
@endphp

@section('content')
    <div class="row justify-content-center mt-3">
        <div class="col-10">
            <div class="row">
                <div class="col-12 text-center">
                    <h2>Quotes for {{$server->name}}</h2>
                    <p>
                        Below is a list of quotes on the server. To have KirBot send the quote in chat, run
                        <code>{{$server->command_discriminator}}quote &lt;id&gt;</code>. The ID can be found in the
                        upper left corner
                    </p>
                    <p>
                        To create a quote, react to any message with &#x1f5e8; (left speech bubble) and KirBot will automatically add it to
                        the database.
                    </p>
                </div>
            </div>
            <div class="quote-container">
                @foreach($quotes as $quote)
                    <div class="quote">
                        <span class="quote-id">{{$quote->id}}</span>
                        <div class="quote-content">
                            {!! $parsedown->text($quote->content) !!}
                        </div>
                        <span class="quote-footer">By @if($quote->userData){{ $quote->userData->username }}
                            #{{ $quote->userData->discriminator }}@else Unknown @endif on {{$quote->created_at}}</span>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
@endsection