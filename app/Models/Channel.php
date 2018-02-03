<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Channel extends Model {

    use DeletesRelations;

    protected $table = "channels";
    public $incrementing = false;

    public $deletableRelations = ['messages'];

    public function server() {
        return $this->belongsTo(Server::class, 'id', 'server');
    }
}
