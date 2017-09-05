<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserInfo;
use Illuminate\Http\Request;

class UserController extends Controller {

    public function name($user) {
        $user = UserInfo::whereId($user)->first();
        if ($user == null) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json([
            'first_name' => $user->first_name,
            'last_name' => $user->last_name
        ]);
    }

    public function names(Request $request) {
        if (!$request->has('names'))
            return response()->json(['error' => 'Names missing'], 422);
        $users = explode(',', $request->get('names'));
        $data = array();
        foreach ($users as $user) {
            $u = UserInfo::whereId($user)->first();
            if ($u != null)
                $data[$user] = [
                    'first_name' => $u->first_name,
                    'last_name' => $u->last_name];
            else
                $data[$user] = null;
        }
        return $data;
    }
}
