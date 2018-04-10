<?php


namespace App;

use Carbon\Carbon;
use Keygen;

class UserRepository
{
    public function getUser($request)
    {
        $user = $request->user;
        $expiresIn = Carbon::now();
        $expiresIn->addSecond($request->expiresIn);
        return User::updateOrCreate(['id' => $request->id], [
            'id' => $request->id,
            'username' => $user['username'],
            'email' => ($request->email == null) ? 'unverified-' . substr($user['username'], 0, 3) . '-' . Keygen::alphanum(10)->generate() . '@kirbot' : $request->email,
            'refresh_token' => $request->refreshToken,
            'token_type' => in_array('guilds', explode(' ', $request->accessTokenResponseBody['scope'])) ? 'NAME_SERVERS' : 'NAME_ONLY',
            'token' => $request->token,
            'expires_in' => $expiresIn->toDateTimeString()
        ]);
    }
}
