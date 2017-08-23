<?php


namespace App\Utils;


use App\ServerSettings;
use App\User;

class DiscordAPI {

    /**
     * Gets the servers the user has access to from the discord API
     * @param User $user The user
     * @return mixed
     */
    public static function getServersFromAPI(User $user) {
        $token = $user->token;
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
                // User's token is not valid
                \App::abort(302, '', ['Location' => '/login?returnUrl=' . \Request::getRequestUri() . '&requireGuilds=true']);
            }
            if($response->getStatusCode() == 429){
                \Log::info("Hit Discord Ratelimit. Aborting...");
                \App::abort(503);
            }
            $body = $response->getBody();
            \Cache::put($cacheId, "$body", 5);
        }
        return json_decode($body);
    }

    /**
     * Gets a server by its id
     * @param User $user The user to use when performing the request
     * @param string $id The id
     * @return mixed
     */
    public static function getServerById(User $user, $id) {
        foreach (DiscordAPI::getServersFromAPI($user) as $server) {
            if ($server->id == $id)
                return $server;
        }
        return null;
    }

    /**
     * Gets the servers the user has access to
     * @param User $user The user
     * @return array
     */
    public static function getServers(User $user) {
        $servers = array();
        foreach (DiscordAPI::getServersFromAPI($user) as $server) {
            if (($server->permissions & 32) > 0) {
                $server->has_icon = $server->icon != null;
                $server->on = ServerSettings::whereId($server->id)->count() > 0;
                $servers[] = $server;
            }
        }
        return $servers;
    }
}