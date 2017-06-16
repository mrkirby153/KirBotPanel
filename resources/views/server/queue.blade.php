@extends('layouts.semantic')


@section('title', 'Music Queue for '.$server->name)


@section('content')

    <div class="ui center aligned segment">
        @if(property_exists($queue, 'nowPlaying') && $queue->nowPlaying != null)
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
                <?php $song = $queue->nowPlaying ?>
                <tr>
                    <td><b>{{$song->title}}</b></td>
                    <td>{{\App\Utils\TimeFormatter::formatTime($song->duration)}}</td>
                    <td>
                        <a class="ui button" href="{{$song->url}}" target="_blank">Link</a>
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
            @if(sizeof($queue->songs) == 0)
                <tfoot>
                <tr>
                    <th colspan="3">
                        Nothing is up next! Queue songs by typing <code>!play [Song Title/Song URL]</code>
                    </th>
                </tr>
                </tfoot>
            @else
                @foreach($queue->songs as $song)
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