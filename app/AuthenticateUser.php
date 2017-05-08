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

    public function execute($hasCode, AuthenticateUserListener $listener, $returnUrl = '/') {
        if (!$hasCode) {
            \Session::put('auth-return-url', $returnUrl);
            return $this->getAuthorization();
        }
        $request = Socialite::with('discord')->user();
        $user = $this->users->getUser($request);
        Auth::login($user, true);
        return $listener->userHasLoggedIn($user, \Session::get('auth-return-url', '/'));
    }

    private function getAuthorization() {
        return Socialite::with('discord')->scopes(['identify', 'email', 'guilds'])->redirect("testing");
    }
}