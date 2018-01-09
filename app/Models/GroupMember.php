<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GroupMember extends RandomIdModel {
    use SoftDeletes;

    protected $table = "user_groups";

    public $incrementing = false;


    protected function group() {
        return $this->belongsTo(Group::class);
    }

}
