@extends('layouts.dashboard')

@section('panel')
    <h2>Infraction Details</h2>
    <div class="card">
        <div class="card-header">
            Infraction #{{$infraction->id}}
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-12">
                    <b>ID: </b>{{$infraction->id}}<br/>
                    <b>Moderator: </b>{{$infraction->moderator->username}}#{{$infraction->moderator->discriminator}} (<code>{{$infraction->moderator->id}}</code>)<br/>
                    <b>User: </b> {{$infraction->user->username}}#{{$infraction->user->discriminator}} (<code>{{$infraction->user->id}}</code>)<br/>
                    <b>Type: </b> {{$infraction->type}}<br/>
                    <b>Reason: </b> {{$infraction->reason}}<br/>
                    <b>Active: </b> {{$infraction->active? 'yes' : 'no'}} <br/>
                    <b>Created At: </b> {{$infraction->created_at}} <br/>
                    <b>Revoked At: </b> {{$infraction->revoked_at}}
                </div>
            </div>
        </div>
    </div>
@endsection