<?php

namespace App\Http\Controllers;

use App\User;
use App\UserInfo;
use Auth;
use Illuminate\Http\Request;

class UserController extends Controller {


    public function displaySettings() {
        return view('userinfo');
    }

    public function updateName(Request $request) {
        $this->validate($request, [
            'firstname' => 'required',
            'lastname' => 'required',
        ]);
        UserInfo::updateOrCreate(['id' => Auth::user()->id], ['id' => Auth::user()->id, 'first_name' => $request->firstname, 'last_name' => $request->lastname]);
    }

    public function getName() {
        $info = Auth::user()->info;
    }
}
