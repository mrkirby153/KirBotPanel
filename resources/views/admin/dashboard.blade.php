@extends('layouts.semantic')

@section('title', 'Admin Dashboard')

@section('content')
    <div class="ui segment">
        <h2>Servers</h2>
        <table class="ui celled table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Created</th>
                </tr>
            </thead>
            <tbody>
            @foreach($servers as $server)
                <tr>
                    <td>
                        {{$server->id}}
                    </td>
                    <td>
                        <a href="{{route('dashboard.general', ['server'=>$server->id])}}">{{$server->name}}</a>
                    </td>
                    <td>
                        {{$server->created_at}}
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
        {{$servers->links()}}
    </div>
@endsection