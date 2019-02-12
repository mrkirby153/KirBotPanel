<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class GuildSettings extends Model
{

    protected $table = "guild_settings";

    protected $fillable = [
        'guild', 'key', 'value'
    ];


    protected function performInsert(Builder $query)
    {
        $this->setAttribute('id', $this->getAttribute('guild') . '_' . $this->getAttribute('key'));
        return parent::performInsert($query);
    }


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
