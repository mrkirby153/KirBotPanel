<?php


namespace App\Utils\OAuth;


use GuzzleHttp\Client;

class OAuthClient
{

    /**
     * @var string|integer
     */
    private $client_id;

    /**
     * @var string
     */
    private $client_secret;

    /**
     * @var string
     */
    private $token_url;

    /**
     * @var string
     */
    private $auth_url;

    /**
     * @var string
     */
    private $redirect_uri;

    /**
     * OAuthClient constructor.
     * @param int|string $client_id
     * @param string $client_secret
     * @param string $token_url
     * @param string $auth_url
     * @param string $redirect_uri
     */
    public function __construct(
        $client_id,
        string $client_secret,
        string $token_url,
        string $auth_url,
        string $redirect_uri
    ) {
        $this->client_id = $client_id;
        $this->client_secret = $client_secret;
        $this->token_url = $token_url;
        $this->auth_url = $auth_url;
        $this->redirect_uri = $redirect_uri;
    }


    /**
     * Gets the auth URL
     *
     * @param array $scopes The scopes of the request
     * @param string $response_type
     * @return string
     */
    public function getAuthURL($scopes, $response_type = 'code')
    {
        $url = $this->auth_url;
        $state = $this->generateStateToken(10);
        \Session::put('oauth_state', $state);
        \Session::put('oauth_scopes', $scopes);
        $params = '?response_type=' . $response_type . '&client_id=' . $this->client_id . '&scope=' . implode(' ',
                $scopes) . '&state=' . $state . '&redirect_uri=' . urlencode($this->redirect_uri);

        return $url . $params;
    }

    public function getAuthTokens($state, $code, $grant_type = 'authorization_code')
    {
        $this->validateState($state);

        $http_client = new Client();

        $response = $http_client->post($this->token_url, [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded'
            ],
            'form_params' => [
                'client_id' => $this->client_id,
                'client_secret' => $this->client_secret,
                'grant_type' => $grant_type,
                'code' => $code,
                'redirect_uri' => $this->redirect_uri,
                'scope' => \Session::get('oauth_scopes')
            ]
        ]);
        $body = (array) json_decode((string) $response->getBody());
        return OAuthTokens::decode($body);
    }

    /**
     * @param $state
     * @return bool If the state validates
     * @throws OAuthException
     */
    private function validateState($state)
    {
        $cached_state = \Session::get('oauth_state');
        if ($cached_state != $state) {
            throw new OAuthException("State validation failed");
        }
        return true;
    }


    private function generateStateToken(
        $length,
        $keyspace = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    ) {
        $pieces = [];
        $max = mb_strlen($keyspace, '8bit') - 1;
        for ($i = 0; $i < $length; $i++) {
            $pieces [] = $keyspace[random_int(0, $max)];
        }
        return implode('', $pieces);
    }

}