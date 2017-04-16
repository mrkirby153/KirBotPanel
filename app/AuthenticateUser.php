<?php


namespace App;

use App\Listeners\AuthenticateUserListener;
use Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthenticateUser {

    /**
     * @var UserRepository
     */
    private $users;

    public function __construct(UserRepository $users) {
        $this->users = $users;
    }

    public function execute($hasCode, AuthenticateUserListener $listener) {
        if (!$hasCode) {
            return $this->getAuthorization();
        }

        $user = $this->users->getUser(Socialite::with('discord')->user());
        Auth::login($user, true);
        return $listener->userHasLoggedIn($user);
    }

    private function getAuthorization() {
        return Socialite::with('discord')->redirect();
    }
}