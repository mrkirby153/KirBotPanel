<?php

namespace App\Models;

class GuildMemberRole extends RandomIdModel {

    protected $table = "guild_member_roles";

    protected $fillable = [
        'server_id', 'user_id', 'role_id'
    ];

    public function user() {
        return $this->belongsTo(GuildMember::class, 'user_id', 'user_id');
    }

    public function role() {
        return $this->hasOne(Role::class, 'id', 'role_id');
    }
}
