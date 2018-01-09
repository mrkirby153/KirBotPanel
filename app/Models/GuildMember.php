<?php

namespace App\Models;


class GuildMember extends RandomIdModel {

    use DeletesRelations;

    protected $deletableRelations = ['roles'];

    protected $table = "guild_members";

    public $incrementing = false;

    protected $fillable = [
        'id', 'server_id', 'user_id', 'user_name', 'user_discrim', 'user_nick'
    ];

    public function roles() {
        return $this->hasMany(GuildMemberRole::class, 'user_id', 'user_id');
    }
}
