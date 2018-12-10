<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AntiRaidSettings extends Model
{
    public $incrementing = false;
    protected $table = "anti_raid_settings";

    protected $fillable = ['id', 'enabled', 'count', 'period', 'action', 'alert_role', 'alert_channel', 'quiet_period'];

    protected $casts = [
        'enabled' => 'boolean'
    ];
}
