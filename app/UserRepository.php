<?php


namespace App;


use Carbon\Carbon;

class UserRepository {

    public function getUser($request) {
        $user = $request->user;
        $expiresIn = Carbon::now();
        $expiresIn->addSecond($request->expiresIn);
        return User::firstOrCreate([
            'id' => $request->id,
            'username' => $user['username'],
            'email' => $user['email'],
            'refresh_token' => $request->refreshToken,
            'token' => $request->token,
            'expires_in' => $expiresIn->toDateTimeString()
        ]);
    }
}