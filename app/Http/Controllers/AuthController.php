<?php

namespace App\Http\Controllers;

use App\AuthenticateUser;
use App\Listeners\AuthenticateUserListener;
use App\User;
use Illuminate\Http\Request;

class AuthController extends Controller implements AuthenticateUserListener
{
    public function login(AuthenticateUser $authenticateUser, Request $request)
    {
        $returnUrl = '/';
        if ($request->has('returnUrl')) {
            $returnUrl = $request->returnUrl;
        }
        return $authenticateUser->execute($request->has('code'), $this, $returnUrl, $request->has('requireGuilds'));
    }

    public function logout()
    {
        \Auth::logout();
        return redirect('/');
    }

    public function userHasLoggedIn(User $user, $returnUrl)
    {
        return redirect($returnUrl);
    }
}
