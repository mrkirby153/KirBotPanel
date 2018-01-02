<?php

namespace App\Http\Controllers\API;

use App\Models\Group;
use App\Models\GroupMember;
use App\Http\Controllers\Controller;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Keygen;

class GroupController extends Controller {


    public function getMembers(Group $group){
        return response()->json($group->members);
    }

    public function deleteGroup(Group $group){
        $group->delete();
        foreach($group->members as $member){
            $member->delete();
        }
        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function getServerGroups(Server $server){
        return response()->json($server->groups->load('members'));
    }

    public function createGroup(Server $server, Request $request){
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
        return \response()->json($group, Response::HTTP_CREATED);
    }

    public function getGroupByName(Server $server, $name){
        return $server->groups->where('group_name', 'like', urldecode($name));
    }

    public function addUserToGroup(Group $group, Request $request){
        $this->validate($request, [
            'id' => 'required'
        ]);
        $member = new GroupMember();
        $member->id = Keygen::alphanum(10)->generate();
        $member->group_id = $group->id;
        $member->user_id = $request->get('id');
        $member->save();
        return \response()->json($member, Response::HTTP_CREATED);
    }

    public function removeUserByUID(Group $group, $uid) {
        GroupMember::whereGroupId($group->id)->whereUserId($uid)->delete();
        return \response()->json([], Response::HTTP_NO_CONTENT);
    }
}
