<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServerController extends Controller {

    public function displayOverview(Request $request) {
        $servers = $this->getServers();
        return view('server.serverlist')->with(['servers' => $servers]);
    }

    private function getServers() {
        $token = \Auth::user()->token;
        $cacheId = "SERVERS-$token";
        $body = "[]";
        if (\Cache::has($cacheId)) {
            $body = \Cache::get($cacheId);
            \Log::info("Loading from cache");
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
            \Log::info($body);
            \Cache::put($cacheId, "$body", 5);
        }
        $servers = array();
        foreach (json_decode($body) as $server) {
            if (($server->permissions & 32) > 0) {
                $server->has_icon = $server->icon != null;
                $servers[] = $server;
            }
        }
        return $servers;
    }
}
