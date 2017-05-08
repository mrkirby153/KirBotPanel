<?php

namespace App\Listeners;

use App\User;

interface AuthenticateUserListener {
    public function userHasLoggedIn(User $user, $returnUrl);
}