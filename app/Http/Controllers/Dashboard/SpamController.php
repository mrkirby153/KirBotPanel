<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Models\SpamSettings;
use Illuminate\Http\Request;
use JavaScript;

class SpamController extends Controller {

    public function index(Server $server) {
        $model = SpamSettings::whereId($server->id)->first();
        Javascript::put([
            'SpamSettings' => $model != null? json_encode($model) : null,
            'Server' => $server
        ]);
        return view('server.dashboard.spam')->with(['tab' => 'spam', 'server' => $server]);
    }

    public function updateSettings(Request $request, Server $server) {
        $this->authorize('update', $server);
        $request->validate([
            'settings' => 'required'
        ]);
        SpamSettings::updateOrCreate(['id' => $server->id], [
            'id' => $server->id,
            'settings' => $request->get('settings')
        ]);
    }
}
