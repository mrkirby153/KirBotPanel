<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuildSettings extends Model
{
    use HasRandomId;

    protected $table = "guild_settings";

    protected $fillable = [
        'guild', 'key', 'value'
    ];


    public function getValueAttribute($value)
    {
        $json = json_decode($value);
        if ($json != null) {
            return (object)$json;
        } else {
            return $value;
        }
    }
}
