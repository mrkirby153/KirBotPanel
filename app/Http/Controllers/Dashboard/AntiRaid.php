<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Server;
use Illuminate\Http\Request;

class AntiRaid extends Controller
{

    function index(Server $server) {
        \JavaScript::put([
            'Server' => $server
        ]);
        return view('server.dashboard.antiraid')->with(['server' => $server, 'tab' => 'raid']);
    }
}
