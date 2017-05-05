<?php

namespace App\Http\Controllers;

use App\CustomCommand;
use App\ServerSettings;
use Illuminate\Http\Request;
use Keygen\Keygen;

class ServerController extends Controller {

    public function displayOverview(Request $request) {
        $servers = $this->getServers();
        return view('server.serverlist')->with(['servers' => $servers]);
    }

    public function showDashboard($server) {
        $serverById = $this->getServerById($server);
        if (($serverById->permissions & 32) <= 0) {
            return redirect('/servers');
        }
        $serverData = ServerSettings::whereId($server)->with('channels')->first();
        \JavaScript::put([
            'Server' => $serverById,
            'ServerData' => $serverData
        ]);
        return view('server.dashboard.general')->with(['server' => $serverById, 'tab' => 'general', 'serverData'=>$serverData]);
    }

    public function showCommands($server, Request $request) {
        if ($request->expectsJson()) {
            return response()->json(CustomCommand::whereServer($server)->get());
        }
        $serverById = $this->getServerById($server);
        if (($serverById->permissions & 32) <= 0) {
            return redirect('/servers');
        }
        $serverData = ServerSettings::whereId($server)->first();
        \JavaScript::put([
            'Server' => $serverById,
            'ServerData' => $serverData,
            'Commands' => CustomCommand::whereServer($server)->get()
        ]);
        return view('server.dashboard.commands')->with(['server' => $serverById, 'tab' => 'commands']);
    }

    public function updateCommand($server, Request $request) {
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required',
            'clearance' => 'required',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
        $cmd = CustomCommand::whereId($request->id)->first();
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        if ($cmd == null) {
            return response()->json(['id' => 'No command was found with that ID!'], 422);
        }
        $exist = CustomCommand::whereName($request->name)->whereServer($server)->first();
        if ($exist->id != $cmd->id) {
            return response()->json(['name' => 'A command already exists with that name on the server'], 422);
        }
        $cmd->name = $request->name;
        $cmd->data = $request->description;
        $cmd->clearance = $request->clearance;
        $cmd->save();
    }

    public function deleteCommand($server, $command) {
        CustomCommand::destroy($command);
    }

    public function updateDiscrim($server, Request $request) {
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        ServerSettings::updateOrCreate(['id' => $server], [
            'command_discriminator' => $request->discriminator
        ]);
    }

    public function createCommand($server, Request $request) {
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required',
            'clearance' => 'required',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        if (CustomCommand::whereName($request->name)->whereServer($server)->count() > 0) {
            return response()->json(['name' => 'A command already exists with that name on this server!'], 422);
        }
        $cmd = new CustomCommand();
        $cmd->id = Keygen::alphanum(10)->generate();
        $cmd->name = strtolower($request->name);
        $cmd->server = $server;
        $cmd->clearance = $request->clearance;
        $cmd->data = $request->description;
        $cmd->save();
    }

    public function setRealnameSettings($server, Request $request) {
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        ServerSettings::updateOrCreate(['id' => $server], [
            'id' => $server,
            'realname' => $request->realnameSetting,
            'require_realname' => ($request->realnameSetting == 'OFF') ? false : $request->requireRealname
        ]);
    }

    public function updateLogging($server, Request $request){
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        if($request->channel == null && $request->enabled){
            return response()->json(['error'=>'You must specify a channel to log to!'], 422);
        }
        ServerSettings::updateOrCreate(['id'=>$server], [
           'id' => $server,
            'log_channel' => $request->enabled? $request->channel : null
        ]);
    }

    public function showCommandList($server) {
        $customCommands = CustomCommand::whereServer($server)->get();
        $server = ServerSettings::whereId($server)->first();
        return view('server.commandlist')->with(['commands' => $customCommands, 'server'=>$server]);
    }

    private function getServers() {
        $servers = array();
        foreach ($this->getServersFromAPI() as $server) {
            if (($server->permissions & 32) > 0) {
                $server->has_icon = $server->icon != null;
                $server->on = ServerSettings::whereId($server->id)->count() > 0;
                $servers[] = $server;
            }
        }
        return $servers;
    }

    private function getServerById($id) {
        foreach ($this->getServersFromAPI() as $server) {
            if ($server->id == $id)
                return $server;
        }
        return null;
    }

    private function getServersFromAPI() {
        $token = \Auth::user()->token;
        $cacheId = "SERVERS-$token";
        $body = "[]";
        if (\Cache::has($cacheId)) {
            $body = \Cache::get($cacheId);
        } else {
            \Log::info("Loading from Discord");
            $client = new \GuzzleHttp\Client();
            $response = $client->request('GET', "https://discordapp.com/api/users/@me/guilds", [
                'headers' => [
                    'User-Agent' => 'KirBotPanel v1.0',
                    'Authorization' => "Bearer $token",
                    'Content-Type' => 'application/json'
                ]
            ]);
            $body = $response->getBody();
            \Cache::put($cacheId, "$body", 5);
        }
        return json_decode($body);
    }
}
