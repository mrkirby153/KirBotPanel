<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClearanceOverride extends Model {
    protected $table = "permission_overrides";

    protected $fillable = [
        'command', 'clearance'
    ];

    public function server() {
        return $this->belongsTo(Server::class, 'server_id');
    }
}
