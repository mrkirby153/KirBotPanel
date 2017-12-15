<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class RandomIdModel extends Model {

    public $incrementing = false;

    protected $keySize = 15;

    protected function performInsert(Builder $query) {
        $this->setId();
        return parent::performInsert($query);
    }

    private function setId(){
        $this->setAttribute($this->getKeyName(), \Keygen::alphaNum($this->keySize)->generate());
    }
}