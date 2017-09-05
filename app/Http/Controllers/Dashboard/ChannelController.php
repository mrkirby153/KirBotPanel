<?php


namespace App\Http\Controllers\Dashboard;


use App\Models\Channel;
use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Utils\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class ChannelController extends Controller {


    public function index(Server $server) {
        $this->authorize('update', $server);
        \JavaScript::put([
            'Channels' => Channel::whereServer($server->id)->get(),
            'ServerId' => $server->id,
        ]);
        return view('server.dashboard.channels')->with(['tab' => 'channels', 'server' => $server]);
    }

    public function visibility($server, $channel, Request $request) {
        Redis::publish('kirbot:channel-visibility', json_encode(['server'=>$server, 'channel'=>$channel, 'visible'=>$request->get('visible')]));
        AuditLogger::log($server, 'channel_visibility', ['channel'=>$channel, 'visible'=>$request->get('visible')]);
    }

}