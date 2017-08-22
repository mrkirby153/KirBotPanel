@extends('layouts.semantic')


@section('title', 'Music Queue for '.$server->name)


@section('content')

    <div class="ui center aligned segment">
        @if($playing != null)
            <h1>Now Playing</h1>
            <table class="ui celled table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Duration</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><b>{{$playing->title}}</b></td>
                    <td>{{\App\Utils\TimeFormatter::formatTime($playing->duration)}}</td>
                    <td>
                        <a class="ui button" href="{{$playing->url}}" target="_blank">Link</a>
                    </td>
                </tr>
                </tbody>
            </table>
        @else
            <h1>Nothing Playing</h1>
        @endif
        <hr/>
        <h1>Up Next</h1>
        <table class="ui celled table">
            <thead>
            <tr>
                <th>Title</th>
                <th>Duration</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            @if(sizeof($queue) == 0)
                <tfoot>
                <tr>
                    <th colspan="3">
                        Nothing is up next! Queue songs by typing <code>{{$server->command_discriminator}}play [Song Title/Song URL]</code>
                    </th>
                </tr>
                </tfoot>
            @else
                @foreach($queue as $song)
                    <tr>
                        <td>{{$song->title}}</td>
                        <td>{{\App\Utils\TimeFormatter::formatTime($song->duration)}}</td>
                        <td>
                            <a class="ui button" href="{{$song->url}}" target="_blank">Link</a>
                        </td>
                    </tr>
                    @endforeach
                    </tbody>
                    @endif
        </table>
    </div>
@endsection