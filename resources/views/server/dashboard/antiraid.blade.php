@extends('layouts.dashboard')

@section('panel')
    <settings-anti-raid inline-template>
        <div class="row">
            <div class="col-12">
                <h2>Anti-Raid Settings</h2>
                <p>
                    Configure anti-raid settings here to quickly clean up raids. The basic flow is as follows: If more
                    than
                    the
                    configured number of users joins within the time threshold, a raid alert will be triggered,
                    notifying
                    the server staff. <br><br>
                    Raid reports are kept for a maximum of 30 days after the raid.
                </p>
                <input-switch label="Master Switch" v-model="form.enabled" @change="save" :disabled="ra"></input-switch>
                <hr/>
                <h3>Detection Settings</h3>
                <form>
                    <div class="form-row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="join-count"><b>Count</b></label>
                                <input type="number" class="form-control" name="join-count" id="join-count" min="0"
                                       v-model="form.count" @change="save" :disabled="readonly"/>
                                <small class="form-text text-muted">The amount of users that have to join</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="join-period"><b>Period</b></label>
                                <input type="number" class="form-control" name="join-period" min="0" id="join-period"
                                       v-model="form.period" @change="save" :disabled="readonly">
                                <small class="form-text text-muted">The period (in seconds) over which the users have to
                                    join.
                                </small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="default-action"><b>Action</b></label>
                                <select name="default-action" id="default-action" class="form-control"
                                        v-model="form.action" @change="save" :disabled="readonly">
                                    <option value="NOTHING">None</option>
                                    <option value="MUTE">Mute</option>
                                    <option value="KICK">Kick</option>
                                    <option value="BAN">Ban</option>
                                </select>
                                <small class="form-text text-muted">The action to apply to users who join during an
                                    ongoing
                                    raid <br/>
                                    Mute only works if configured in the <a
                                            href="{{route('dashboard.general', ['server'=>$server])}}">general</a> tab
                                </small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="quiet-period"><b>Quiet Period</b></label>
                                <input type="number" min="0" name="quiet-period" id="quiet-period" class="form-control"
                                       v-model="form.quiet_period" @change="save" :disabled="readonly">
                                <small class="form-text text-muted">
                                    The amount of time (in seconds) between joins when the raid will be automatically
                                    canceled and a report generated.
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
                                <select name="alert-role" id="alert-role" class="form-control"
                                        v-model="form.alert_role" @change="save" :disabled="readonly">
                                    <option value="">None</option>
                                    @foreach($server->roles as $role)
                                        @if($role->name != "@everyone")
                                            <option value="{{$role->id}}">{{$role->name}}</option>
                                        @endif
                                    @endforeach
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
                                <select name="alert-channel" id="alert-channel" class="form-control"
                                        v-model="form.alert_channel" @change="save" :disabled="readonly">
                                    <option value="" disabled selected>Select a Channel</option>
                                    @foreach($server->channels as $channel)
                                        @if($channel->type == "TEXT")
                                            <option value="{{$channel->id}}">#{{$channel->channel_name}}</option>
                                        @endif
                                    @endforeach
                                </select>
                                <small class="form-text text-muted">The channel where the raid alert will be sent
                                </small>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </settings-anti-raid>
@endsection