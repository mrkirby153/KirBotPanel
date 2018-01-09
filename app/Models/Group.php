<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends RandomIdModel {
    use SoftDeletes;
    use DeletesRelations;

    protected $table = "groups";

    protected $deletableRelations = ['members'];

    public $incrementing = false;

    public function members() {
        return $this->hasMany(GroupMember::class);
    }
}
