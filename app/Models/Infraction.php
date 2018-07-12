<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Infraction extends Model
{
    protected $table = "infractions";

    protected $casts = [
        'active' => 'boolean'
    ];

    protected $with = [
        'user', 'moderator'
    ];


    public function user()
    {
        return $this->belongsTo(DiscordUser::class, 'user_id', 'id');
    }

    public function moderator()
    {
        return $this->belongsTo(DiscordUser::class, 'issuer', 'id');
    }
}
