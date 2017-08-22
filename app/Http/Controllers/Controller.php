<?php

namespace App\Http\Controllers;

use App\Channel;
use App\ServerSettings;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    private $connect_timeout = 0.25; // 1/4 a second

    protected function getServerById($id) {
        foreach ($this->getServersFromAPI() as $server) {
            if ($server->id == $id)
                return $server;
        }
        return null;
    }

    public static  function getServersFromAPI() {
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
        /*        $client = new \GuzzleHttp\Client();
                try {
                    $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server, [
                        'connect_timeout' => $this->connect_timeout
                    ]);
                    $channels = json_decode($response->getBody());
                    return $channels != null? $channels : Channel::whereServer($server)->get();
                } catch (ConnectException $exception) {
                    return Channel::whereServer($server)->get();
                }*/
        return Channel::whereServer($server)->get();

    }

    protected function getTextChannelsFromBot($server) {
        /*        $client = new \GuzzleHttp\Client();
                try {
                    $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server . '/text', [
                        'connect_timeout' => $this->connect_timeout
                    ]);
                    $channels = json_decode($response->getBody());
                    return $channels != null ? $channels : Channel::whereServer($server)->whereType('TEXT')->get();
                } catch (ConnectException $exception) {
                    return Channel::whereServer($server)->whereType('TEXT')->get();
                }*/

        return Channel::whereServer($server)->whereType('TEXT')->get();

    }

    protected function getVoiceChannelsFromBot($server) {
        /*        $client = new \GuzzleHttp\Client();
                try {
                    $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server . '/voice', [
                        'connect_timeout' => $this->connect_timeout
                    ]);
                    $channels = json_decode($response->getBody());
                    return $channels != null ? $channels : Channel::whereServer($server)->get();
                } catch (ConnectException $exception) {
                    return Channel::whereServer($server)->whereType('VOICE')->get();
                }*/

        return Channel::whereServer($server)->whereType('VOICE')->get();

    }
}
