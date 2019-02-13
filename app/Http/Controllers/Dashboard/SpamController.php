<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\CensorSettings;
use App\Models\Guild;
use App\Models\Server;
use App\Models\SpamSettings;
use App\Utils\SettingsRepository;
use Illuminate\Http\Request;
use JavaScript;

class SpamController extends Controller
{
    public function index(Guild $server)
    {
        Javascript::put([
            'Server' => $server
        ]);
        return view('server.dashboard.spam')->with(['tab' => 'spam', 'server' => $server]);
    }

    public function updateSettings(Request $request, Guild $server)
    {
        $this->authorize('update', $server);
        $request->validate([
            'settings' => 'required'
        ]);
        SettingsRepository::set($server, 'spam_settings', $request->get('settings'));
    }

    public function updateCensor(Request $request, Guild $server)
    {
        $this->authorize('update', $server);
        $request->validate([
            'settings' => 'required'
        ]);
        SettingsRepository::set($server, 'censor_settings', $request->get('settings'));
    }
}
