<?php

namespace App\Http\Controllers;

use App\AuthenticateUser;
use App\Listeners\AuthenticateUserListener;
use App\User;
use App\Utils\OAuth\DiscordOAuthUserRepository;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function showLogin(Request $request)
    {
        return view('login');
    }

    public function doLogin(Request $request)
    {
        if($request->has('code')) {
            $client = DiscordOAuthUserRepository::getOAuthClient();
            $tokens = $client->getAuthTokens($request->get('state'), $request->get('code'));
            $user = DiscordOAuthUserRepository::getOrCreateUser($tokens);
            \Auth::login($user, true);
            return redirect(\Session::get('auth-return-url', '/'));
        } else {
            $returnUrl = $request->get('returnUrl', '/');
            \Session::put("auth-return-url", $returnUrl);
            return redirect(DiscordOAuthUserRepository::getOAuthClient()->getAuthURL(['identify', 'guilds']));
        }
    }

    public function logout()
    {
        \Auth::logout();
        return redirect('/');
    }
}
