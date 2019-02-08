<?php


namespace App\Utils\OAuth;


use App\User;
use GuzzleHttp\Client;

class DiscordOAuthUserRepository
{


    public static function getRawUser($token)
    {
        $client = new Client();
        $response = $client->get('https://discordapp.com/api/v6/users/@me', [
            'headers' => [
                'Authorization' => 'Bearer ' . $token
            ]
        ]);
        $resp_body = $response->getBody();
        $body = json_decode($resp_body);
        \Cache::put("user_$token", json_encode($body), 5);
        return $body;
    }


    public static function getUser($token)
    {
        $id = self::getRawUser($token)->id;
        return User::first($id);
    }

    public static function getOrCreateUser(OAuthTokens $tokens)
    {
        $raw_user = self::getRawUser($tokens->getAccessToken());
        $user = User::firstOrCreate(['id' => $raw_user->id], [
            'id' => $raw_user->id,
            'token' => $tokens->getAccessToken(),
            'refresh_token' => $tokens->getExpiresAt(),
            'expires_in' => $tokens->getExpiresAt()
        ]);
        if(!$user->created) {
            $user->username = $raw_user->username;
            $user->token = $tokens->getAccessToken();
            $user->refresh_token = $tokens->getRefreshToken();
            $user->expires_in = $tokens->getExpiresAt();
            $user->save();
        }
        return $user;
    }

    public static function getOAuthClient($redirect_uri = null)
    {
        return new OAuthClient(env('DISCORD_KEY'), env('DISCORD_SECRET'),
            'https://discordapp.com/api/oauth2/token', 'https://discordapp.com/api/oauth2/authorize',
            $redirect_uri != null ? $redirect_uri : env('DISCORD_REDIRECT_URI'));
    }
}