<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Utils\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class MusicController extends Controller
{
    public function index(Server $server)
    {
        $this->authorize('view', $server);
        $server->load('channels');
        \JavaScript::put([
            'Music' => $server->musicSettings,
            'Server' => $server
        ]);
        return view('server.dashboard.music')->with(['server' => $server, 'tab' => 'music', 'channels' => $this->getVoiceChannelsFromBot($server->id)]);
    }

    public function displayQueue($server)
    {
        $queue = $this->getQueue($server);
        $playing = $this->getNowPlaying($server);
        $server = Server::whereId($server)->first();
        if ($server == null) {
            $server = new Server(['name' => 'Unknown']);
        }
        return view('server.queue')->with(['queue' => $queue, 'server' => $server, 'playing'=>$playing]);
    }

    public function getQueueJson($server)
    {
        return response()->json([
            'nowPlaying' => $this->getNowPlaying($server),
            'queue' => $this->getQueue($server)
        ]);
    }

    public function update(Request $request, Server $server)
    {
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
        $musicSettings->channels = $request->channels;
        $musicSettings->blacklist_songs = implode(',', explode("\n", $request->blacklisted_urls));
        $musicSettings->save();
    }

    private function getQueue($server)
    {
        $data = Redis::get("music.queue:$server");
        if ($data == null) {
            return json_decode("[]");
        } else {
            return json_decode($data);
        }
    }

    private function getNowPlaying($server)
    {
        $data = Redis::get("music.playing:$server");
        if ($data == null) {
            return null;
        } else {
            return json_decode($data);
        }
    }
}
