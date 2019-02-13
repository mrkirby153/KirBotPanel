<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\AntiRaidSettings;
use App\Models\Guild;
use App\Models\Server;
use App\Utils\SettingsRepository;
use Illuminate\Http\Request;

class AntiRaid extends Controller
{

    function index(Guild $server)
    {
        $server->load(['channels', 'roles']);
        \JavaScript::put([
            'Server' => $server
        ]);
        return view('server.dashboard.antiraid')->with(['server' => $server, 'tab' => 'raid']);
    }

    function update(Guild $server, Request $request)
    {
        $this->authorize('update', $server);
        $values = [];
        $enabled = $request->get('enabled');
        foreach ($request->all([
            'count',
            'period',
            'quiet_period',
            'alert_channel',
            'enabled',
            'alert_role',
            'action'
        ]) as $k => $v) {
            $values['anti_raid_' . $k] = $enabled ? $v : null;
        }
        SettingsRepository::setMultiple($server, $values);
    }
}
