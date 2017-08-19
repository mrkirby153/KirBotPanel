<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServerSettings extends Model {
    public $table = "server_settings";

    public $incrementing = false;

    public $fillable = [
        'id', 'name', 'realname', 'require_realname', 'command_discriminator', 'log_channel', 'cmd_whitelist', 'bot_manager'
    ];

    public function channels() {
        return $this->hasMany(Channel::class, 'server', 'id');
    }

    public function roles(){
        return $this->hasMany(Role::class, 'server_id');
    }

    public function quotes(){
        return $this->hasMany(Quote::class, 'server_id');
    }

}
