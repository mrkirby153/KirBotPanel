<?php


namespace App\Utils;

use App\Models\Server;
use App\User;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;

class DiscordAPI
{

    /**
     * Gets the servers the user has access to from the discord API
     * @param User $user The user
     * @param bool $refreshAttempted If a refresh was attempted
     * @return mixed
     */
    public static function getServersFromAPI(User $user, $refreshAttempted = false)
    {
        if ($user->token_type != "NAME_SERVERS") {
            self::redirectToLogin(); // This token doesn't have access to servers
        }
        if (!self::isApiTokenValid($user)) {
            \Log::debug("API token is out of date. Refreshing");
            if (!self::attemptRefresh($user)) {
                \Log::debug("API refresh failed. Redirecting to login");
                self::redirectToLogin();
            }
        }
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
                // User's token is not valid, attempt to refresh it
                if (!self::attemptRefresh($user)) {
                    self::redirectToLogin(); // Refresh failed, redirecting to login
                } else {
                    if ($refreshAttempted) {
                        self::redirectToLogin();
                    } else {
                        return self::getServersFromAPI($user, true);
                    }
                }
            }
            if ($response->getStatusCode() == 429) {
                \Log::warning("Hit Discord Ratelimit. Aborting...");
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
    public static function getServerById(User $user, $id)
    {
        foreach (DiscordAPI::getServersFromAPI($user) as $server) {
            if ($server->id == $id) {
                return $server;
            }
        }
        return null;
    }

    /**
     * Gets the servers the user has access to
     * @param User $user The user
     * @return array
     */
    public static function getServers(User $user)
    {
        $servers = array();
        foreach (DiscordAPI::getServersFromAPI($user) as $server) {
            $server->has_icon = $server->icon != null;
            $server->on = Server::whereId($server->id)->count() > 0;
            $server->manager = self::hasPermission($server->permissions, 0x00000020);
            $servers[] = $server;
        }
        usort($servers, function ($a, $b) {
            if ($a->on && !$b->on) {
                return -1;
            }
            if ($b->on && !$a->on) {
                return 1;
            }
            return strtolower($a->name) <=> strtolower($b->name);
        });
        return $servers;
    }

    /**
     * Attempts a refresh of the user's access token
     * @param User $user
     * @return bool True if successful
     */
    public static function attemptRefresh(User $user)
    {
        $client = new Client();
        try {
            $response = $client->post('https://discordapp.com/api/v6/oauth2/token', [
                'form_params' => [
                    'client_id' => env('DISCORD_KEY'),
                    'client_secret' => env('DISCORD_SECRET'),
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $user->refresh_token,
                    'redirect_uri' => env('DISCORD_REDIRECT_URI')
                ],
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded'
                ]
            ]);
        } catch (ClientException $e) {
            // Refresh failed
            return false;
        }
        if ($response->getStatusCode() != 200) {
            return false;
        }
        $body = (array)\GuzzleHttp\json_decode((string)$response->getBody());
        $user->token = $body['access_token'];
        $carbon = Carbon::now();
        $carbon->addSeconds($body['expires_in']);
        $user->expires_in = $carbon->toDateTimeString();
        return $user->save();
    }

    /**
     * Checks if the API token is valid
     * @param User $user
     * @return bool True if the api token is valid
     */
    private static function isApiTokenValid(User $user)
    {
        return Carbon::now()->timestamp < Carbon::parse($user->expires_in)->timestamp;
    }

    private static function redirectToLogin()
    {
        \App::abort(302, '', ['Location' => '/login?returnUrl=' . \Request::getRequestUri() . '&requireGuilds=true']);
    }

    public static function hasPermission($permissionRaw, $permission)
    {
        return ($permissionRaw & $permission) > 0;
    }
}
