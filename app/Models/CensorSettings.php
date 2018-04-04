<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CensorSettings extends Model
{
    protected $table = "censor_settings";


    protected $fillable = [
        'id', 'settings'
    ];
}
