<?php

namespace App\Http\Controllers;

use App\ServerSettings;
use Illuminate\Http\Request;

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

    public function setRealnameSettings($server, Request $request) {
        ServerSettings::updateOrCreate(['id' => $server], [
            'id' => $server,
            'realname' => $request->realnameSetting,
            'require_realname' => ($request->realnameSetting == 'OFF')? false : $request->requireRealname
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
