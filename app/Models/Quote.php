<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $table = "quotes";


    public function server(){
        return $this->belongsTo(Server::class, 'server_id');
    }
}