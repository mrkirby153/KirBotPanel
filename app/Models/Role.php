<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = "roles";

    public $incrementing = false;


    public function server()
    {
        return $this->belongsTo(Guild::class, 'server_id');
    }
}
