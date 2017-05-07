<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MusicSettings extends Model
{
    public $incrementing = false;

    protected $fillable = [
        'id', 'enabled', 'mode', 'channels', 'blacklist_songs', 'max_queue_length', 'max_song_length', 'skip_cooldown', 'skip_timer', 'playlists'
    ];
}
