<?php


namespace App\Http\Controllers\Dashboard;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ChannelController extends Controller {


    public function index($server) {
        $serverById = $this->getServerById($server);
        if (($serverById->permissions & 32) <= 0) {
            return redirect('/servers');
        }
        \JavaScript::put([
            'Channels' => $this->getChannelsFromBot($server),
            'ServerId' => $server,
        ]);
        return view('server.dashboard.channels')->with(['tab' => 'channels', 'server' => $serverById]);
    }

    public function visibility($server, $channel, Request $request) {
        $client = new \GuzzleHttp\Client();

        $response = $client->request('POST', env('KIRBOT_URL') . 'v1/server/' . $server . '/channel/' . $channel . '/visibility', [
            'form_params' => [
                'visible' => $request->get('visible')
            ]
        ]);
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