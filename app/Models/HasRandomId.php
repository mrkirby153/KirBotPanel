<?php


namespace app\Models;


trait HasRandomId
{

    protected $keySize = 15;

    public static function bootHasRandomId()
    {
        static::creating(function ($item) {
            $item->setAttribute($item->getRandomKeyName(), \Keygen::alphanum($item->keySize)->generate());
        });
    }

    protected function getRandomKeyName()
    {
        return $this->getKeyName();
    }
}