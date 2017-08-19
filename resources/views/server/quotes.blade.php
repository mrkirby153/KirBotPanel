@extends('layouts.semantic')


@section('title', 'Quotes for '.$server->name)


@section('content')
    @foreach($quotes as $quote)
        <div class="ui top attached header">(<a>#{{$quote->id}}</a>) {{$quote->user}}</div>
        <div class="ui attached segment">
            {{$quote->content}}
        </div>
        <h4 class="ui right aligned bottom attached header">Quoted on {{$quote->created_at}}</h4>
    @endforeach
@endsection