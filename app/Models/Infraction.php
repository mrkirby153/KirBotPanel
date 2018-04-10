<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Infraction extends Model
{
    protected $table = "infractions";

    protected $casts = [
        'active' => 'boolean'
    ];

    public function issuedBy()
    {
        return $this->belongsTo(GuildMember::class, 'issuer', 'user_id');
    }

    public function user()
    {
        return $this->belongsTo(GuildMember::class, 'user_id', 'user_id');
    }
}
