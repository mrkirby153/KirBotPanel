<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Guild;
use App\Models\Server;
use App\Utils\AuditLogger;
use App\Utils\Redis\RedisMessage;
use App\Utils\RedisMessenger;
use App\Utils\SettingsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class MusicController extends Controller {
    public function index(Guild $server) {
        $this->authorize('view', $server);
        $server->load('channels');
        \JavaScript::put([
            'Server' => $server
        ]);
        return view('server.dashboard.music')->with(['server' => $server, 'tab' => 'music', 'channels' => $this->getVoiceChannelsFromBot($server->id)]);
    }

    public function displayQueue(Guild $server) {
        \JavaScript::put([
            'Server' => $server
        ]);
        $queue = $this->getQueue($server->id);
        $playing = $this->getNowPlaying($server->id);
        $in_channel = Redis::get("music:".$server->id.":channel:".\Auth::id());
        return view('server.queue')->with(['queue' => $queue, 'server' => $server, 'playing' => $playing, 'in_channel' => (bool) $in_channel]);
    }

    public function webQueue(Guild $server, Request $request) {
        RedisMessenger::dispatch(new RedisMessage("webqueue", $server, \Auth::user(), [
            'query' => $request->input('song')
        ]));
    }

    public function getQueueJson($server) {
        return response()->json([
            'nowPlaying' => $this->getNowPlaying($server),
            'queue' => $this->getQueue($server)
        ]);
    }

    public function update(Request $request, Guild $server) {
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

        SettingsRepository::setMultiple($server, [
            'music_enabled' => $request->input('enabled'),
            'music_mode' => $request->input('whitelist_mode'),
            'music_max_queue_length' => $request->input('max_queue_length'),
            'music_max_song_length' => $request->input('max_song_length'),
            'music_skip_cooldown' => $request->input('skip_cooldown'),
            'music_skip_timer' => $request->input('skip_timer'),
            'music_playlists' => $request->input('playlists')
        ]);
    }

    private function getQueue($server) {
        $data = Redis::get("music.queue:$server");
        if ($data == null) {
            return json_decode("[]");
        } else {
            return json_decode($data);
        }
    }

    private function getNowPlaying($server) {
        $data = Redis::get("music.playing:$server");
        if ($data == null) {
            return null;
        } else {
            return json_decode($data);
        }
    }
}
