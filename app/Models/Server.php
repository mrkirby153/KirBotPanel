<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    use DeletesRelations;

    public $table = "server_settings";

    public $incrementing = false;

    public $fillable = [
        'id',
        'name',
        'realname',
        'require_realname',
        'command_discriminator',
        'log_channel',
        'cmd_whitelist',
        'bot_manager'
    ];

    protected $casts = [
        'cmd_whitelist' => 'array',
        'bot_manager' => 'array',
        'user_persistence',
        'boolean'
    ];

    protected $deletableRelations = [
        'channels',
        'roles',
        'quotes',
        'commands',
        'musicSettings',
        'groups',
        'overrides',
        'feeds',
        'auditLog',
        'members'
    ];

    public function channels()
    {
        return $this->hasMany(Channel::class, 'server', 'id');
    }

    public function roles()
    {
        return $this->hasMany(Role::class, 'server_id')->orderBy('order', 'DESC');
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class, 'server_id');
    }

    public function commands()
    {
        return $this->hasMany(CustomCommand::class, 'server');
    }

    public function musicSettings()
    {
        return $this->hasOne(MusicSettings::class, 'id');
    }

    public function infractions()
    {
        return $this->hasMany(Infraction::class, 'guild');
    }

    public function logSettings()
    {
        return $this->hasMany(LogSetting::class, 'server_id');
    }

    public function save(array $options = [])
    {
        $save = parent::save($options);
        syncServer($this->getAttribute('id'));
        return $save;
    }
}
