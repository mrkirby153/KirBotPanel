@extends('layouts.dashboard')

@section('panel')
    @php
        $color = \App\Menu\Panel::getPanelColor($tab);
    @endphp

    <div class="ui {{$color}} segment">
        <table class="ui celled table">
            <thead>
            <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>User Name</th>
                <th>Issuer</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Active</th>
                <th>Created At</th>
                <th>Revoked At</th>
            </tr>
            </thead>
            <tbody>
            @foreach($infractions as $infraction)
                <tr>
                    <td>{{$infraction->id}}</td>
                    <td>{{$infraction->user_id}}</td>
                    @if($infraction->user)
                        <td>{{$infraction->user->user_name}}#{{$infraction->user->user_discrim}}</td>
                    @else
                        <td>Unknown</td>
                    @endif
                    @if($infraction->issuedBy)
                        <td>{{$infraction->issuedBy->user_name}}#{{$infraction->issuedBy->user_discrim}}</td>
                    @else
                        @if($infraction->issuer)
                            <td>{{$infraction->issuer}}</td>
                        @else
                            <td>Unknown</td>
                        @endif
                    @endif
                    <td>{{$infraction->type}}</td>
                    <td>{{$infraction->reason}}</td>
                    <td>{{$infraction->active? "true" : "false"}}</td>
                    <td>{{$infraction->created_at}}</td>
                    <td>{{$infraction->revoked_at}}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endsection