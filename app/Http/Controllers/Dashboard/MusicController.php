<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\MusicSettings;
use App\ServerSettings;
use App\Utils\AuditLogger;
use Illuminate\Http\Request;
use Mockery\Exception;

class MusicController extends Controller {

    public function index(ServerSettings $server) {
        $this->authorize('update', $server);
        \JavaScript::put([
            'Music' => $server->musicSettings,
            'Server' => $server
        ]);
        return view('server.dashboard.music')->with(['server' => $server, 'tab' => 'music', 'channels' => $this->getVoiceChannelsFromBot($server->id)]);

    }

    public function displayQueue($server) {
        // TODO 8/21/2017 - Pull from redis
        $queue = $this->getQueue($server);
        $server = ServerSettings::whereId($server)->first();
        if($server == null)
            $server = new ServerSettings(['name'=>'Unknown']);
        return view('server.queue')->with(['queue'=>$queue, 'server'=>$server]);
    }

    public function update(Request $request, ServerSettings $server) {
        $this->authorize('update', $server);
        $this->validate($request, [
            'enabled' => 'required',
            'whitelist_mode' => 'required',
            'max_queue_length' => 'required|numeric',
            'max_song_length' => 'required|numeric',
            'skip_cooldown' => 'required|numeric',
            'skip_timer' => 'required',
            'playlists' => 'required'
        ]);

        $musicSettings = $server->musicSettings;
        $musicSettings->fill($request->all());
        $musicSettings->mode = $request->whitelist_mode;
        $musicSettings->channels = implode(',', $request->channels);
        $musicSettings->blacklist_songs = implode(',', explode("\n", $request->blacklisted_urls));
        AuditLogger::log($server->id, "music_update", $musicSettings);
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
