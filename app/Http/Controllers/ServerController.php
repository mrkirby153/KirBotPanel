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
        $serverData = ServerSettings::whereId($server)->first();
        \JavaScript::put([
            'Server' => $serverById,
            'ServerData' => $serverData
        ]);
        return view('server.dashboard.general')->with(['server' => $serverById, 'tab' => 'general']);
    }

    public function showCommands($server, Request $request) {
        if ($request->expectsJson()) {
            return response()->json(CustomCommand::whereServer($server)->get());
        }
        $serverById = $this->getServerById($server);
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
        if ($cmd == null) {
            return response()->json(['id' => 'No command was found with that ID!'], 422);
        }
        $exist = CustomCommand::whereName($request->name)->whereServer($server)->first();
        if($exist->id != $cmd->id){
            return response()->json(['name'=>'A command already exists with that name on the server'], 422);
        }
        $cmd->name = $request->name;
        $cmd->data = $request->description;
        $cmd->clearance = $request->clearance;
        $cmd->save();
    }

    public function deleteCommand($server, $command){
        CustomCommand::destroy($command);
    }

    public function createCommand($server, Request $request) {
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required',
            'clearance' => 'required',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
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
        ServerSettings::updateOrCreate(['id' => $server], [
            'id' => $server,
            'realname' => $request->realnameSetting,
            'require_realname' => ($request->realnameSetting == 'OFF') ? false : $request->requireRealname
        ]);
    }

    private function getServers() {
        $servers = array();
        foreach ($this->getServersFromAPI() as $server) {
            if (($server->permissions & 32) > 0) {
                $server->has_icon = $server->icon != null;
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
