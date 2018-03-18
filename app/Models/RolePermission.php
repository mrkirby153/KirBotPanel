<?php

namespace App\Models;

class RolePermission extends RandomIdModel {

    public $incrementing = false;
    protected $table = "role_permissions";

    protected $fillable = [
        'id', 'server_id', 'role_id', 'permission_level'
    ];
}
