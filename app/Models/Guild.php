<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Guild extends Model
{
    use SoftDeletes;

    protected $table = "guild";

    public $incrementing = false;

    protected $with = [
        'settings'
    ];

    public function settings()
    {
        return $this->hasMany(GuildSettings::class, 'guild');
    }

    public function getIcon()
    {
        if ($this->getAttribute('icon_id') == null) {
            return route('serverIcon') . '?server_name=' . urlencode($this->getAttribute('name'));
        } else {
            return "https://cdn.discordapp.com/icons/" . $this->getAttribute('id') . "/" . $this->getAttribute('icon_id') . ".png";
        }
    }

    public function roles() {
        return $this->hasMany(Role::class, 'server_id')->orderBy('order', 'desc');
    }

    public function channels() {
        return $this->hasMany(Channel::class, 'server');
    }

}
