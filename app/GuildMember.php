<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GuildMember extends Model {
    protected $table = "guild_members";

    public $incrementing = false;

    protected $fillable = [
        'id', 'server_id', 'user_id', 'user_name', 'user_discrim', 'user_nick'
    ];
}
