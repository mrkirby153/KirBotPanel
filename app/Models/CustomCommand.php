<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Redis;

class CustomCommand extends Model {
    public $incrementing = false;

    public function server() {
        return $this->belongsTo(Server::class, 'server');
    }

    public function save(array $options = []) {
        $save = parent::save($options);
        Redis::publish("kirbot:sync", \GuzzleHttp\json_encode(['guild' => $this->getAttribute('server')]));
        return $save;
    }
}
