<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\MusicSettings;
use App\ServerSettings;
use App\Utils\AuditLogger;
use Illuminate\Http\Request;
use Mockery\Exception;

class MusicController extends Controller {

    public function index(Request $request, $server) {
        \Log::info($request);
        $serverById = $this->getServerById($server);
        if (($serverById->permissions & 32) <= 0) {
            return redirect('/servers');
        }
        $musicSettings = MusicSettings::firstOrCreate(['id' => $server], [
            'id' => $server,
            'enabled' => true,
            'mode' => 'OFF',
            'channels' => '',
            'blacklist_songs' => '',
            'max_queue_length' => -1,
            'max_song_length' => -1,
            'skip_cooldown' => 0,
            'skip_timer' => 30,
        ]);
        \JavaScript::put([
            'Server' => $serverById,
            'Music' => $musicSettings
        ]);
        return view('server.dashboard.music')->with(['server' => $serverById, 'tab' => 'music', 'channels' => $this->getVoiceChannelsFromBot($server)]);

    }

    public function displayQueue($server) {
        $queue = $this->getQueue($server);
        $server = ServerSettings::whereId($server)->first();
        if($server == null)
            $server = new ServerSettings(['name'=>'Unknown']);
        return view('server.queue')->with(['queue'=>$queue, 'server'=>$server]);
    }

    public function update(Request $request, $server) {
        $this->validate($request, [
            'enabled' => 'required',
            'whitelist_mode' => 'required',
            'max_queue_length' => 'required|numeric',
            'max_song_length' => 'required|numeric',
            'skip_cooldown' => 'required|numeric',
            'skip_timer' => 'required',
            'playlists' => 'required'
        ]);
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }

        $musicSettings = MusicSettings::whereId($server)->first();
        $musicSettings->fill($request->all());
        $musicSettings->mode = $request->whitelist_mode;
        $musicSettings->channels = implode(',', $request->channels);
        $musicSettings->blacklist_songs = implode(',', explode("\n", $request->blacklisted_urls));

        AuditLogger::log($server, "music_update", $musicSettings);

        $musicSettings->save();

    }

    private function getQueue($server) {
        try {
            $guzzle = new \GuzzleHttp\Client();
            $data = $guzzle->get(env('KIRBOT_URL') . 'v1/server/' . $server . '/queue');
            return json_decode($data->getBody());
        } catch (Exception $exception) {
            // Fall through
        }
        return [
            'length' => 0,
            'nowPlaying' => null,
            'playing' => false,
            'songs' => []
        ];

    }
}
