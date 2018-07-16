@extends('layouts.master')

@section('title', 'Command List - '.$server->name)

@section('content')
    <div class="row justify-content-center mt-2">
        <div class="col-8">
            <div class="card">
                <div class="card-header">
                    Command List for {{$server->name}}
                </div>
                <div class="card-body">
                    <p>
                        Below is a list of all custom commands registered on the server.
                    </p>
                    <table class="table table-hover">
                        <thead class="thead-light text-center">
                        <tr>
                            <th scope="col">Command Name</th>
                            <th scope="col" style="width: 50px">Clearance</th>
                            <th scope="col">Response</th>
                        </tr>
                        </thead>
                        <tbody>
                        @if(sizeof($commands) < 1)
                            <tr>
                                <td colspan="3">
                                    <b>No custom commands are currently set on this server</b>
                                </td>
                            </tr>
                        @endif
                        @foreach($commands as $command)
                            <tr>
                                <td class="text-center">{{$server->command_discriminator}}{{$command->name}}</td>
                                <td class="text-center">{{$command->clearance_level}}</td>
                                <td>{{$command->data}}</td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection