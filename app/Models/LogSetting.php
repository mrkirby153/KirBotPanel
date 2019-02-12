<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogSetting extends Model
{
    use HasRandomId;
    protected $table = "log_settings";

    public $incrementing = false;

    protected $fillable = [
        'server_id',
        'channel_id',
        'included',
        'excluded'
    ];

    protected $with = [
        'channel'
    ];

    public function server()
    {
        return $this->belongsTo(Guild::class, 'server_id');
    }

    public function channel()
    {
        return $this->belongsTo(Channel::class, 'channel_id');
    }
}
