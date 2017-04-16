<?php

namespace App\Http\Controllers;

use App\AuthenticateUser;
use App\Listeners\AuthenticateUserListener;
use App\User;
use Illuminate\Http\Request;

class AuthController extends Controller implements AuthenticateUserListener {

    public function login(AuthenticateUser $authenticateUser, Request $request) {
        return $authenticateUser->execute($request->has('code'), $this);
    }

    public function logout() {
        \Auth::logout();
        return redirect('/');
    }

    public function userHasLoggedIn(User $user){
        return redirect('/');
    }
}
