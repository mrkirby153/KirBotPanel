<?php

namespace App\Http\Controllers;

use App\Models\Guild;
use App\Models\LogSetting;
use App\Utils\SettingsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class ApiController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getCurrentUser()
    {
        return \Auth::user();
    }

    public function getLogEvents()
    {
        $events = Redis::get('log_events');
        return response()->json(json_decode($events));
    }

    public function getLogSettings(Guild $guild)
    {
        $this->authorize('view', $guild);
        return LogSetting::whereServerId($guild->id)->get();
    }

    public function getLogTimezone(Guild $guild) {
        $this->authorize('view', $guild);
        return SettingsRepository::get($guild, 'log_timezone', 'UTC', true);
    }

    public function updateLogSettings(Request $request, Guild $guild, LogSetting $settings) {
        $this->authorize('update', $guild);
        $settings->included = $request->input('include');
        $settings->excluded = $request->input('exclude');
        $settings->save();
        return $settings;
    }

    public function deleteLogSettings(Guild $guild, LogSetting $settings) {
        $this->authorize('update', $guild);
        return $settings->delete() ? "true" : "false";
    }

    public function createLogSettings(Request $request, Guild $guild) {
        $this->authorize('update', $guild);
        return LogSetting::create([
            'server_id' => $guild->id,
            'channel_id' => $request->input('channel'),
            'included' => 0,
            'excluded' => 0
        ])->load('channel');
    }
}
