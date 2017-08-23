<?php

namespace App\Http\Controllers;

use App\ServerSettings;
use Illuminate\Http\Request;

class BotChatController extends Controller
{


    public function index(){
        return view('botchat');
    }

    public function getServers(){
        return ServerSettings::get();
    }

    public function getChannels(ServerSettings $server){
        return $this->getTextChannelsFromBot($server->id);
    }

    public function sendMessage(Request $request){
        \Redis::publish("kirbot:botchat", json_encode(['server'=>$request->get('server'),
            'channel' => $request->get('channel'), 'message' => $request->get('message')]));
    }
}
