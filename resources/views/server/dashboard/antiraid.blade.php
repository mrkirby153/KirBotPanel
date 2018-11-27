@extends('layouts.dashboard')

@section('panel')
    <div class="row">
        <div class="col-12">
            <h2>Anti-Raid Settings</h2>
            <p>
                Configure anti-raid settings here to quickly clean up raids. The basic flow is as follows: If more than
                the
                configured number of users joins within the time threshold, a raid alert will be triggered, notifying
                the server staff
            </p>
            <input-switch label="Master Switch"></input-switch>
            <hr/>
            <h3>Detection Settings</h3>
            <form>
                <div class="form-row">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="join-count"><b>Count</b></label>
                            <input type="number" class="form-control" name="join-count" id="join-count" min="0"/>
                            <small class="form-text text-muted">The amount of users that have to join</small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label for="join-period"><b>Period</b></label>
                            <input type="number" class="form-control" name="join-period" min="0" id="join-period">
                            <small class="form-text text-muted">The period (in seconds) over which the users have to
                                join. <br/>
                                Mute only works if configured in the <a
                                        href="{{route('dashboard.general', ['server'=>$server])}}">general</a> tab
                            </small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label for="default-action"><b>Action</b></label>
                            <select name="default-action" id="default-action" class="form-control">
                                <option value="NOTHING">None</option>
                                <option value="MUTE">Mute</option>
                                <option value="KICK">Kick</option>
                                <option value="BAN">Ban</option>
                            </select>
                            <small class="form-text text-muted">The action to apply to users who join during an ongoing
                                raid
                            </small>
                        </div>
                    </div>
                </div>
            </form>
            <hr/>
            <h3>Alert Settings</h3>
            <form>
                <div class="form-row">
                    <div class="col-6">
                        <div class="form-group">
                            <label for="alert-role"><b>Alert Role</b></label>
                            <select name="alert-role" id="alert-role" class="form-control">
                                <option value="">None</option>
                                <option value="@here">@here</option>
                                <option value="@everyone">@everyone</option>
                            </select>
                            <small class="form-text text-muted">The role to ping when a potential raid is detected.
                            </small>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label for="alert-channel"><b>Alert Channel</b></label>
                            <select name="alert-channel" id="alert-channel" class="form-control">
                                <option value="" disabled selected>Select a Channel</option>
                            </select>
                            <small class="form-text text-muted">The channel where the raid alert will be sent</small>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection