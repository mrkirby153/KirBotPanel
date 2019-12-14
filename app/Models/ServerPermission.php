<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServerPermission extends Model
{
    use HasRandomId;

    protected $table = "server_permissions";

    protected $fillable = [
        'user_id', 'server_id', 'permission'
    ];

    public $incrementing = false;

    protected $keyType = 'string';
}
