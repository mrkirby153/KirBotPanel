<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $table = "quotes";

    protected $fillable = [
        'server_id', 'user', 'content', 'message_id'
    ];

    protected $with = [
        'userData'
    ];


    public function server()
    {
        return $this->belongsTo(Guild::class, 'server_id');
    }

    public function userData(){
        return $this->belongsTo(DiscordUser::class, 'user');
    }
}
