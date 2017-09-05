<?php

namespace App;

use App\Models\UserInfo;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'username', 'email', 'token', 'refresh_token', 'expires_in', 'token_type'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'remember_token', 'token', 'refresh_token', 'expires_in'
    ];

    public $incrementing = false;

    public function info(){
        return $this->hasOne(UserInfo::class, 'id');
    }
}
