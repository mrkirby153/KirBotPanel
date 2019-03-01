<?php

namespace App\Http\Controllers;

use App\Models\Guild;
use App\Models\LogSetting;
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
        return LogSetting::whereServerId($guild->id)->get();
    }
}
