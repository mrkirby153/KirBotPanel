<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscordUser extends Model
{
    protected $table = "seen_users";

    public $incrementing = false;

    protected $keyType = 'string';

    public function getDiscriminatorAttribute($value)
    {
        if ($value < 1000) {
            return "0$value";
        } else {
            return $value;
        }
    }
}
