<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model {

    protected $table = "channels";
    public $incrementing = false;


    public function server() {
        return $this->belongsTo(ServerSettings::class, 'id', 'server');
    }
}
