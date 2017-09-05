<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomCommand extends Model
{
    public $incrementing = false;

    public function server(){
        return $this->belongsTo(ServerSettings::class, 'server');
    }
}
