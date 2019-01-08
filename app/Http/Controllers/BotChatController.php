<?php

namespace App\Http\Controllers;

use App\Models\Server;
use App\Utils\Redis\RedisMessage;
use App\Utils\RedisMessenger;
use Illuminate\Http\Request;

class BotChatController extends Controller {
    public function index() {
        return view('botchat');
    }

    public function getServers() {
        return Server::get();
    }

    public function getChannels(Server $server) {
        return $this->getTextChannelsFromBot($server->id);
    }

    public function sendMessage(Request $request) {
        if ($request->user()->admin)
            RedisMessenger::dispatch(new RedisMessage("botchat", $request->input('server'), null, [
                'channel' => $request->input('channel'),
                'message' => $request->input('message')
            ]));
    }
}
