<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model {
    public $incrementing = false;

    public $fillable = ['id', 'first_name', 'last_name'];

    public $table = "user_info";

    public function user() {
        return $this->belongsTo(User::class);
    }
}
