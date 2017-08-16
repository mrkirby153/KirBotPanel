<?php


namespace App\Http\Controllers\Dashboard;


use App\Channel;
use App\Http\Controllers\Controller;
use App\Utils\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class ChannelController extends Controller {


    public function index($server) {
        $serverById = $this->getServerById($server);
        if (($serverById->permissions & 32) <= 0) {
            return redirect('/servers');
        }
        \JavaScript::put([
            'Channels' => Channel::whereServer($server)->get(),
            'ServerId' => $server,
        ]);
        return view('server.dashboard.channels')->with(['tab' => 'channels', 'server' => $serverById]);
    }

    public function visibility($server, $channel, Request $request) {
        Redis::publish('kirbot:channel-visibility', json_encode(['server'=>$server, 'channel'=>$channel, 'visible'=>$request->get('visible')]));
        AuditLogger::log($server, 'channel_visibility', ['channel'=>$channel, 'visible'=>$request->get('visible')]);
    }

    public function regainAccess($server, $channel) {
        $client = new \GuzzleHttp\Client();

        $resp = $client->request('POST', env('KIRBOT_URL') . 'v1/server/' . $server . '/channel/' . $channel . '/grantAccess', [
            'form_params' =>[
                'user' => \Auth::user()->id
            ]
        ]);
    }

}