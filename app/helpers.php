<?php

/**
 * @param $server mixed The server to sync
 */
function syncServer($server) {
    if ($server instanceof \App\Models\Server) {
        $server = $server->id;
    }
    \Illuminate\Support\Facades\Redis::publish("kirbot:sync", json_encode(['guild' => $server]));
}