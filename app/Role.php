<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = "roles";

    public $incrementing = false;


    public function server(){
        return $this->belongsTo(ServerSettings::class, 'server_id');
    }
}
