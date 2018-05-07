<?php

namespace App\Models;

class LogSetting extends RandomIdModel
{
    protected $table = "log_settings";

    public $incrementing = false;

    protected $fillable = [
        'server_id',
        'channel_id',
        'events'
    ];

    protected $with = [
        'channel'
    ];

    public function server()
    {
        return $this->belongsTo(Server::class, 'server_id');
    }

    public function channel()
    {
        return $this->belongsTo(Channel::class, 'channel_id');
    }
}
