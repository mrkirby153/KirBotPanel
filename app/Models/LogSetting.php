<?php

namespace App\Models;

class LogSetting extends RandomIdModel
{
    protected $table = 'log_settings';

    protected $fillable = [
        'id', 'server_id', 'channel_id', 'events'
    ];
}
