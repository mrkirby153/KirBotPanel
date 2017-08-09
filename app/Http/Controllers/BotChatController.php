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
        $guzzle = new \GuzzleHttp\Client();
        $guzzle->post(env('KIRBOT_URL').'v1/server/'.$request->get('server').'/channel/'.$request->get('channel').'/message', [
            'form_params'=>[
                'message' => $request->get('message')
            ]
        ]);
    }
}
