<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Channel;
use App\Models\CustomCommand;
use App\Models\GuildMember;
use App\Models\MusicSettings;
use App\Models\Role;
use App\Models\Server;
use App\Models\ServerMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ServerController extends Controller {

    public function getCommands($server) {
        return CustomCommand::whereServer($server)->get(['name', 'data', 'clearance', 'type', 'respect_whitelist']);
    }

    public function getSettings($server) {
        $server = Server::whereId($server)->first(['name', 'realname', 'bot_nick', 'require_realname', 'command_discriminator', 'log_channel', 'cmd_whitelist', 'bot_manager','user_persistence']);
        if (!is_array($server->bot_manager)) {
            $server->bot_manager = [$server->bot_manager];
        }
        if ($server == null) {
            return response()->json(['error' => 'Server not found!'], 404);
        }
        return $server;
    }

    public function serverExists($server){
        return response()->json(['exists'=>Server::whereId($server)->first() != null]);
    }

    public function setName(Request $request, $server) {
        if (!$request->has('name')) {
            return response()->json(['name' => 'Name is required'], 422);
        }
        Server::updateOrCreate(['id' => $server], ['name' => $request->get('name')]);
        return response()->json(['success' => 'Name updated!']);
    }

    public function register(Request $request) {
        $settings = new Server();
        $settings->name = $request->get('name');
        $settings->id = $request->get('id');
        $settings->cmd_whitelist = [];
        $settings->command_discriminator = '!';
        $settings->bot_manager = [];
        $settings->save();
        $musicSettings = new MusicSettings([
            'id' => $settings->id,
            'enabled' => true,
            'mode' => 'OFF',
            'channels' => '',
            'blacklist_songs' => '',
            'max_queue_length' => -1,
            'max_song_length' => -1,
            'skip_cooldown' => 0,
            'skip_timer' => 30,
        ]);
        $musicSettings->save();
        return response()->json($settings, Response::HTTP_CREATED);
    }

    public function unregister(Server $server) {
        MusicSettings::destroy($server->id);
        CustomCommand::whereServer($server->id)->delete();
        ServerMessage::whereServerId($server->id)->delete();
        Channel::whereServer($server->id)->delete();
        GuildMember::whereServerId($server->id)->delete();
        $server->delete();
        return \response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function registerChannel($server, Request $request) {
        $request->validate([
            'id' => 'required|numeric',
            'name' => 'required',
            'type' => 'required'
        ]);
        $chan = new Channel();
        $chan->server = $server;
        $chan->id = $request->get('id');
        $chan->channel_name = $request->get('name');
        $chan->type = $request->get('type');
        $chan->save();
        return \response()->json($chan, Response::HTTP_CREATED);
    }

    public function updateChannel(Channel $channel, Request $request) {
        $request->validate([
            'name' => 'required',
            'hidden' => 'required|boolean'
        ]);
        $channel->channel_name = $request->get('name');
        $channel->hidden = $request->get('hidden') == "true";
        $channel->save();
        return \response()->json($channel);
    }

    public function removeChannel($channel) {
        Channel::destroy($channel);
        ServerMessage::whereChannel($channel)->delete();
        return \response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function getChannels($server) {
        return response()->json([
            'voice' => Channel::whereServer($server)->whereType('VOICE')->get(),
            'text' => Channel::whereServer($server)->whereType('TEXT')->get()
        ]);
    }

    public function getMusicSettings($server) {
        return MusicSettings::whereId($server)->first();
    }

    public function getRoles(Server $server) {
        return Role::whereServerId($server->id)->get();
    }
}
