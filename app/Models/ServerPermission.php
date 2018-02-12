<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServerPermission extends RandomIdModel
{

    protected $table = "server_permissions";

    protected $fillable = [
        'user_id', 'server_id', 'permission'
    ];
}
