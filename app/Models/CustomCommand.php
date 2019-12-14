<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomCommand extends Model
{
    use HasRandomId;

    public $incrementing = false;

    protected $casts = [
        'respect_whitelist' => 'boolean'
    ];

    protected $keyType = 'string';

    public function guild()
    {
        return $this->belongsTo(Guild::class, 'server');
    }

    public function save(array $options = [])
    {
        $save = parent::save($options);
        syncServer($this->getAttribute('server'));
        return $save;
    }
}
