<?php


namespace App\Utils\OAuth;


use Carbon\Carbon;

class OAuthTokens
{

    private $access_token;

    private $token_type;

    private $expires_at;

    private $refresh_token;

    private $scopes;

    /**
     * OAuthTokens constructor.
     * @param $access_token
     * @param $token_type
     * @param $expires_in
     * @param $refresh_token
     * @param $scopes
     */
    public function __construct($access_token, $token_type, $expires_in, $refresh_token, $scopes)
    {
        $this->access_token = $access_token;
        $this->token_type = $token_type;
        $this->refresh_token = $refresh_token;
        $this->scopes = $scopes;
        $this->expires_at = Carbon::now()->addSecond($expires_in);
    }

    /**
     * @return mixed
     */
    public function getAccessToken()
    {
        return $this->access_token;
    }

    /**
     * @return mixed
     */
    public function getTokenType()
    {
        return $this->token_type;
    }

    /**
     * @return static
     */
    public function getExpiresAt()
    {
        return $this->expires_at;
    }

    /**
     * @return mixed
     */
    public function getRefreshToken()
    {
        return $this->refresh_token;
    }

    /**
     * @return mixed
     */
    public function getScopes()
    {
        return $this->scopes;
    }


    public static function decode($json)
    {
        return new OAuthTokens($json['access_token'], $json['token_type'], $json['expires_in'], $json['refresh_token'],
            explode(' ', $json['scope']));
    }

}