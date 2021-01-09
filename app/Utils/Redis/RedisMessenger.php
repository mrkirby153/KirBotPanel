<?php


namespace App\Utils\Redis;


use App\Utils\Redis\RedisMessage;
use Illuminate\Support\Facades\Redis;

class RedisMessenger {

    /**
     * Dispatches a message to KirBot
     *
     * @param RedisMessage $message
     */
    public static function dispatch(RedisMessage $message) {
        Redis::publish("kirbot", $message->asJson());
    }
}
