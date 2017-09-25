<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Server extends Model {
    public $table = "server_settings";

    public $incrementing = false;

    public $fillable = [
        'id', 'name', 'realname', 'require_realname', 'command_discriminator', 'log_channel', 'cmd_whitelist', 'bot_manager'
    ];

    protected $casts = [
        'cmd_whitelist' => 'array',
        'bot_manager' => 'array'
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

    public function commands(){
        return $this->hasMany(CustomCommand::class, 'server');
    }

    public function musicSettings(){
        return $this->hasOne(MusicSettings::class, 'id');
    }

    public function groups() {
        return $this->hasMany(Group::class, 'server_id');
    }

    public function overrides(){
        return $this->hasMany(ClearanceOverride::class, 'server_id');
    }
}