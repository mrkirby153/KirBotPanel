<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomCommand extends Model {
    public $incrementing = false;

    public function server() {
        return $this->belongsTo(Server::class, 'server');
    }

    public function save(array $options = []) {
        $save = parent::save($options);
        syncServer($this->getAttribute('server'));
        return $save;
    }
}
