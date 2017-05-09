@extends('layouts.semantic')


@section('title', 'Commands for '.$server->name)


@section('content')
    <table class="ui celled table">
        <thead>
        <tr>
            <th>Command Name</th>
            <th>Response</th>
        </tr>
        </thead>
        <tbody>
        @if(sizeof($commands) < 1)
            <tr>
                <th colspan="2">
                    <div class="ui center aligned segment">
                        No commands currently exist on this server!
                    </div>
                </th>
            </tr>
        @else
            @foreach($commands as $command)
                <tr>
                    <td>
                        {{$server->command_discriminator.$command->name}}
                    </td>
                    <td>
                        {{$command->data}}
                    </td>
                </tr>
            @endforeach
        @endif
        </tbody>
    </table>
@endsection