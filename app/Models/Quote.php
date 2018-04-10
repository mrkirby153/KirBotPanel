<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $table = "quotes";

    protected $fillable = [
        'server_id', 'user', 'content', 'message_id'
    ];


    public function server()
    {
        return $this->belongsTo(Server::class, 'server_id');
    }
}
