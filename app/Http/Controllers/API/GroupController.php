<?php

namespace App\Http\Controllers\API;

use App\Group;
use App\GroupMember;
use App\Http\Controllers\Controller;
use App\ServerSettings;
use Illuminate\Http\Request;
use Keygen;

class GroupController extends Controller {


    public function getMembers(Group $group){
        return response()->json(['members'=>$group->members]);
    }

    public function deleteGroup(Group $group){
        $group->delete();
        foreach($group->members as $member){
            $member->delete();
        }
    }

    public function getServerGroups(ServerSettings $server){
        return response()->json(['groups'=>$server->groups->load('members')]);
    }

    public function createGroup(ServerSettings $server, Request $request){
        $this->validate($request, [
            'name' => 'required',
            'role' => 'required'
        ]);
        if(Group::whereGroupName($request->get('name'))->first() != null){
            return response()->json(['name'=>'Names must be unique!'], 422);
        }
        $group = new Group();
        $group->id = Keygen::alphanum(10)->generate();
        $group->group_name = $request->get('name');
        $group->server_id = $server->id;
        $group->role_id = $request->get('role');
        $group->save();
        return $group;
    }

    public function getGroupByName(ServerSettings $server, $name){
        return $server->groups->where('group_name', 'like', urldecode($name));
    }

    public function addUserToGroup(Group $group, Request $request){
        $member = new GroupMember();
        $member->id = Keygen::alphanum(10)->generate();
        $member->group_id = $group->id;
        $member->user_id = $request->get('id');
        $member->save();
        return $member;
    }

    public function removeUserByUID(Group $group, $uid) {
        GroupMember::whereGroupId($group->id)->whereUserId($uid)->delete();
    }
}
