<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClearanceOverride extends Model {
    protected $table = "permission_overrides";

    public function server() {
        return $this->belongsTo(ServerSettings::class, 'server_id');
    }
}
