<?php

namespace App\Http\Controllers\API;

use App\Channel;
use App\CustomCommand;
use App\Http\Controllers\Controller;
use App\MusicSettings;
use App\ServerMessage;
use App\ServerSettings;
use Illuminate\Http\Request;

class ServerController extends Controller {

    public function getCommands($server) {
        return response()->json(['cmds'=>CustomCommand::whereServer($server)->get(['name', 'data', 'clearance', 'type', 'respect_whitelist'])]);
    }

    public function getSettings($server) {
        $server = ServerSettings::whereId($server)->first(['name', 'realname', 'require_realname', 'command_discriminator', 'log_channel', 'cmd_whitelist']);
        if ($server == null) {
            return response()->json(['error' => 'Server not found!'], 404);
        }
        return $server;
    }

    public function setName(Request $request, $server) {
        if (!$request->has('name')) {
            return response()->json(['name' => 'Name is required'], 422);
        }
        ServerSettings::updateOrCreate(['id' => $server], ['name' => $request->get('name')]);
        return response()->json(['success' => 'Name updated!']);
    }

    public function register(Request $request) {
        $settings = new ServerSettings();
        $settings->name = $request->get('name');
        $settings->id = $request->get('id');
        $settings->cmd_whitelist = '';
        $settings->command_discriminator = '!';
        $settings->save();
    }

    public function unregister(ServerSettings $server) {
        MusicSettings::destroy($server->id);
        CustomCommand::whereServer($server->id)->delete();
        ServerMessage::whereServerId($server->id)->delete();
        Channel::whereServer($server->id)->delete();
        $server->delete();
    }

    public function registerChannel($server, Request $request) {
        $chan = new Channel();
        $chan->server = $server;
        $chan->id = $request->get('id');
        $chan->channel_name = $request->get('name');
        $chan->type = $request->get('type');
        $chan->save();
    }

    public function updateChannel(Channel $channel, Request $request) {
        $channel->channel_name = $request->get('name');
        $channel->save();
    }

    public function removeChannel($channel) {
        Channel::destroy($channel);
        ServerMessage::whereChannel($channel)->delete();
    }

    public function getChannels($server){
        return response()->json([
            'voice' => Channel::whereServer($server)->whereType('VOICE')->get(),
            'text' => Channel::whereServer($server)->whereType('TEXT')->get()
        ]);
    }

    public function getMusicSettings($server){
        return MusicSettings::whereId($server)->first();
    }
}
