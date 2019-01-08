<?php

namespace App\Http\Controllers;

use App\Models\Server;
use App\Models\UserInfo;
use App\Utils\Redis\RedisMessage;
use App\Utils\RedisMessenger;
use Auth;
use Illuminate\Http\Request;
use Redis;

class UserController extends Controller
{
    public function displaySettings(Request $request)
    {
        $serverName = "";
        if ($request->has('serverId')) {
            $serverName = Server::whereId($request->serverId)->first()->name;
        }
        \JavaScript::put([
            'Name' => trim($this->getName())
        ]);
        $userInfo = Auth::guest() ? null : UserInfo::whereId(Auth::id())->first();
        return view('userinfo', ['server' => $serverName, 'serverId' => $request->serverId, 'userInfo' => $userInfo]);
    }

    public function updateName(Request $request)
    {
        $this->validate($request, [
            'firstname' => 'required',
            'lastname' => 'required',
        ]);
        $info = UserInfo::whereId(Auth::user()->id)->first();
        if ($info == null) {
            $info = new UserInfo();
        } else {
            if ($info->changed) {
                return response()->json(['error'=>'You have already changed your name once!'], 422);
            } else {
                if ($info->first_name != $request->firstname || $info->last_name != $request->lastname) {
                    $info->changed += 1;
                }
            }
        }
        $info->first_name = $request->firstname;
        $info->last_name = $request->lastname;
        $info->id = Auth::user()->id;
        $info->save();
        RedisMessenger::dispatch(new RedisMessage("update-names"));
        return response()->json(['changed'=>$info->changed]);
    }

    public function getName()
    {
        if (Auth::guest()) {
            return null;
        }
        $info = Auth::user()->info;
        if ($info == null) {
            return null;
        }
        return $info->first_name . " " . $info->last_name;
    }
}
