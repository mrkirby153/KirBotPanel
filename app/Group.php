<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model {
    use SoftDeletes;

    protected $table = "groups";

    public $incrementing = false;

    public function members() {
        return $this->hasMany(GroupMember::class);
    }
}
