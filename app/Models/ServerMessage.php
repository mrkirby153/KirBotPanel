<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServerMessage extends Model {

    protected $table = "server_messages";

    public $incrementing = false;

    protected $fillable = [
        'id', 'server_id', 'author', 'channel', 'message'
    ];
}
