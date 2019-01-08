<?php


namespace App\Utils\Redis;


use App\User;

/**
 *  A message that will be sent to the KirBot bot instance over Redis
 *
 * @package App\Utils\Redis
 */
class RedisMessage {

    private $key = "";

    private $server = null;

    private $payload = [];

    /**
     * @var User|null
     */
    private $user = null;

    /**
     * RedisMessage constructor.
     *
     * @param $key string The message key
     * @param $server string|null The server the message affects
     * @param $user User|null The user sending the payload
     * @param $payload array|mixed The payload to send
     */
    public function __construct($key, $server = null, $user = null, $payload = []) {
        $this->key = $key;
        $this->server = $server;
        $this->payload = $payload;
    }

    /**
     * @return string
     */
    public function getKey(): string {
        return $this->key;
    }

    /**
     * @return mixed|string|null
     */
    public function getServer() {
        return $this->server;
    }

    /**
     * @return array|mixed
     */
    public function getPayload() {
        return $this->payload;
    }

    /**
     * Gets the payload
     * @return array
     */
    public function getRawPayload() {
        return [
            'command' => $this->getKey(),
            'guild' => $this->getServer(),
            // Default to the user ID of the currently logged in user
            'user' => $this->user != null? $this->user->id : \Auth::id(),
            'data' => $this->getPayload()
        ];
    }

    /**
     * Gets the payload as a json string
     *
     * @return false|string
     */
    public function asJson() {
        return json_encode($this->getRawPayload());
    }
}