<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomCommand extends RandomIdModel {
    public $incrementing = false;

    public function guild() {
        return $this->belongsTo(Server::class, 'server');
    }

    public function save(array $options = []) {
        $save = parent::save($options);
        syncServer($this->getAttribute('server'));
        return $save;
    }
}
