<?php

namespace App\Models;

use App\Models\scopes\GuildSettingsScope;
use App\Utils\Redis\RedisMessage;
use App\Utils\RedisMessenger;
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


    protected static function boot()
    {
        self::saving(function (GuildSettings $model) {
            if ($model->isDirty()) {
                $msg = new RedisMessage("setting-update", $model->guild, [
                    'key' => $model->key,
                    'value' => $model->value
                ]);
                RedisMessenger::dispatch($msg);
            }
        });
        self::deleting(function (GuildSettings $model) {
            $msg = new RedisMessage("settings-delete", $model->guild, [
                'key' => $model->key
            ]);
            RedisMessenger::dispatch($msg);
        });
        parent::boot();
    }

    protected function performInsert(Builder $query)
    {
        $this->setAttribute('id', $this->getAttribute('guild') . '_' . $this->getAttribute('key'));
        return parent::performInsert($query);
    }


    public function getValueAttribute($value)
    {
        $json = json_decode($value);
        if ($value == "true" || $value == "false") {
            return $value == "true" ? true : false;
        }
        if ($json != null) {
            return $json;
        } else {
            return $value;
        }
    }
}
