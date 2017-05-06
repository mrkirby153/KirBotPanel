<?php

namespace App\Http\Controllers\Dashboard;

use App\Channel;
use App\CustomCommand;
use App\Http\Controllers\Controller;
use App\MusicSettings;
use App\ServerSettings;
use Illuminate\Http\Request;

class MusicController extends Controller {

    public function index(Request $request, $server) {
        \Log::info($request);
        $serverById = $this->getServerById($server);
        if (($serverById->permissions & 32) <= 0) {
            return redirect('/servers');
        }
        $musicSettings = MusicSettings::firstOrCreate(['id'=>$server], [
            'id'=>$server,
            'enabled'=>true,
            'mode'=>'OFF',
            'channels'=>'',
            'blacklist_songs'=>'',
            'max_queue_length'=>-1,
            'max_song_length'=>-1,
            'skip_cooldown'=>0,
            'skip_timer'=>30,
        ]);
        $channels = Channel::whereServer($server)->get();
        \JavaScript::put([
            'Server' => $serverById,
            'Music' => $musicSettings
        ]);
        return view('server.dashboard.music')->with(['server' => $serverById, 'tab' => 'music', 'channels'=>$channels]);

    }
}
