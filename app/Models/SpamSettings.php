<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpamSettings extends Model
{
    public $incrementing = false;

    protected $table = "spam_settings";

    protected $fillable = [
        'id', 'settings'
    ];
}
