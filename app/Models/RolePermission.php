<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RolePermission extends Model
{
    use HasRandomId;

    public $incrementing = false;
    protected $table = "role_permissions";

    protected $fillable = [
        'id', 'server_id', 'role_id', 'permission_level'
    ];
}
