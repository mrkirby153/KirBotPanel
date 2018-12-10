<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AntiRaidSettings;
use App\Models\Server;
use Illuminate\Http\Request;

class AntiRaid extends Controller
{

    function index(Server $server)
    {
        $raidSettings = AntiRaidSettings::whereId($server->id)->first();
        $server->load(['channels', 'roles']);
        if ($raidSettings == null) {
            // Create the raid settings if it doesn't exist
            $raidSettings = new AntiRaidSettings();
            $raidSettings->id = $server->id;
            $raidSettings->save();
            $raidSettings->refresh(); // Pull the default values from the database
        }
        \JavaScript::put([
            'Server' => $server,
            'RaidSettings' => $raidSettings
        ]);
        return view('server.dashboard.antiraid')->with(['server' => $server, 'tab' => 'raid']);
    }

    function update(Server $server, Request $request)
    {
        return AntiRaidSettings::updateOrCreate(['id' => $server->id], array_merge($request->all(), ['id' => $server->id]));
    }
}
