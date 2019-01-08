<?php

/**
 * @param $server mixed The server to sync
 */
function syncServer($server) {
    if ($server instanceof \App\Models\Server) {
        $server = $server->id;
    }
    \App\Utils\RedisMessenger::dispatch(new \App\Utils\Redis\RedisMessage("sync", $server));
}
