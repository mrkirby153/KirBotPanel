<?php

namespace App\Http\Controllers;

use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class BotChatController extends Controller
{


    public function index(){
        return view('botchat');
    }

    public function getServers(){
        return Server::get();
    }

    public function getChannels(Server $server){
        return $this->getTextChannelsFromBot($server->id);
    }

    public function sendMessage(Request $request){
        Redis::publish("kirbot:botchat", json_encode(['server'=>$request->get('server'),
            'channel' => $request->get('channel'), 'message' => $request->get('message')]));
    }
}
