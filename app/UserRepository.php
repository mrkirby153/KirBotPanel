<?php


namespace App;


class UserRepository {

    public function getUser($request) {
        $user = $request->user;
        return User::firstOrCreate(['id' => $request->id, 'username' => $user['username'], 'email' => $user['email']]);
    }
}