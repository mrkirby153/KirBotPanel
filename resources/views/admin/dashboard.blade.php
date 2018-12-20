@extends('layouts.master')

@section('title', 'Admin Dashboard')

@section('content')
    <div class="row justify-content-center mt-2">
        <div class="col-8">
            <div class="card">
                <div class="card-header">
                    Admin
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 table-responsive">
                            <h2>Server List</h2>
                            <table class="table text-center">
                                <thead class="thead-light">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                @foreach($servers as $server)
                                    <tr>
                                        <td>{{$server->id}}</td>
                                        <td>{{$server->name}}</td>
                                        <td>{{$server->created_at}}</td>
                                        <td class="d-flex justify-content-center">
                                            <div class="btn-group">
                                                <a class="btn btn-success"
                                                   href="{{route('dashboard.general', ['server'=>$server->id])}}"><i
                                                            class="fas fa-pencil-alt"></i> Manage</a>
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
