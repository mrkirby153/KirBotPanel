<?php

namespace App\Http\Controllers\Dashboard;

use App\Channel;
use App\Http\Controllers\Controller;
use App\MusicSettings;
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
        \JavaScript::put([
            'Server' => $serverById,
            'Music' => $musicSettings
        ]);
        return view('server.dashboard.music')->with(['server' => $serverById, 'tab' => 'music', 'channels'=>$this->getVoiceChannelsFromBot($server)]);

    }

    public function update(Request $request, $server){
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }

        $musicSettings = MusicSettings::whereId($server)->first();
        $musicSettings->fill($request->all());
        $musicSettings->mode = $request->whitelist_mode;
        $musicSettings->channels = implode(',', $request->channels);
        $musicSettings->blacklist_songs = implode(',', explode("\n", $request->blacklisted_urls));

        $musicSettings->save();

    }
}
