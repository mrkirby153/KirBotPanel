<?php

namespace App\Http\Controllers;

use App\Channel;
use App\ServerSettings;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function getServers() {
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

    protected function getServerById($id) {
        foreach ($this->getServersFromAPI() as $server) {
            if ($server->id == $id)
                return $server;
        }
        return null;
    }

    protected function getServersFromAPI() {
        $token = \Auth::user()->token;
        $cacheId = "SERVERS-$token";
        $body = "[]";
        if (\Cache::has($cacheId)) {
            $body = \Cache::get($cacheId);
        } else {
            $client = new \GuzzleHttp\Client(['http_errors' => false]);
            $response = $client->request('GET', "https://discordapp.com/api/users/@me/guilds", [
                'headers' => [
                    'User-Agent' => 'KirBotPanel v1.0',
                    'Authorization' => "Bearer $token",
                    'Content-Type' => 'application/json'
                ]
            ]);
            if ($response->getStatusCode() == 401) {
                // Abort and immediately go to the login page
                \App::abort(302, '', ['Location' => '/login?returnUrl=' . \Request::getRequestUri() . '&requireGuilds=true']);
            }
            $body = $response->getBody();
            \Cache::put($cacheId, "$body", 5);
        }
        return json_decode($body);
    }

    protected function getChannelsFromBot($server) {
        $client = new \GuzzleHttp\Client();
        try {
            $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server . '');
            $channels = json_decode($response->getBody());
            return $channels != null? $channels : Channel::whereServer($server)->get();
        } catch (ConnectException $exception) {
            return Channel::whereServer($server)->get();
        }

    }

    protected function getTextChannelsFromBot($server) {
        $client = new \GuzzleHttp\Client();
        try{
            $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server . '/text');
            $channels = json_decode($response->getBody());
            return $channels != null? $channels : Channel::whereServer($server)->whereType('TEXT')->get();
        } catch(ConnectException $exception){
            return Channel::whereServer($server)->whereType('TEXT')->get();
        }

    }

    protected function getVoiceChannelsFromBot($server) {
        $client = new \GuzzleHttp\Client();
        try{
            $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server . '/voice');
            $channels = json_decode($response->getBody());
            return $channels != null? $channels : Channel::whereServer($server)->get();
        } catch(ConnectException $exception){
            return Channel::whereServer($server)->whereType('VOICE')->get();
        }

    }
}
