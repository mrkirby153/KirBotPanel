<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class GuildSettings extends Model
{

    protected $table = "guild_settings";

    protected $fillable = [
        'guild',
        'key',
        'value'
    ];

    public $incrementing = false;


    protected function performInsert(Builder $query)
    {
        $this->setAttribute('id', $this->getAttribute('guild') . '_' . $this->getAttribute('key'));
        return parent::performInsert($query);
    }


    public function getValueAttribute($value)
    {
        $json = json_decode($value);
        if ($value == "[]") {
            return array();
        }
        iF ($value == "true" || $value == "false") {
            return $value == "true" ? true : false;
        }
        if ($json != null) {
            return $json;
        } else {
            return $value;
        }
    }
}
