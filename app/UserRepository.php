<?php


namespace App;


use Carbon\Carbon;

class UserRepository {

    public function getUser($request) {
        $user = $request->user;
        $expiresIn = Carbon::now();
        $expiresIn->addSecond($request->expiresIn);
        return User::updateOrCreate(['id' => $request->id], [
            'id' => $request->id,
            'username' => $user['username'],
            'email' => $user['email'],
            'refresh_token' => $request->refreshToken,
            'token_type' => in_array('guilds', explode(' ', $request->accessTokenResponseBody['scope']))? 'NAME_SERVERS' : 'NAME_ONLY',
            'token' => $request->token,
            'expires_in' => $expiresIn->toDateTimeString()
        ]);
    }
}