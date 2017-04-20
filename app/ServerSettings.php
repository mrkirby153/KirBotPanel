<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServerSettings extends Model {
    public $table = "server_settings";

    public $incrementing = false;

    public $fillable = [
        'id', 'realname', 'require_realname', 'command_discriminator'
    ];

}
