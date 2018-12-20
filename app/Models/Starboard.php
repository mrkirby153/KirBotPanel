<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Starboard extends Model {
    protected $table = "starboard_settings";

    protected $fillable = [
        'enabled', 'star_count', 'gild_count', 'self_star', 'channel_id'
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'self_star' => 'boolean'
    ];
}
