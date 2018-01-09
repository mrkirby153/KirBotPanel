<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GuildMember;
use App\Models\GuildMemberRole;
use App\Models\Role;
use Illuminate\Http\Request;

class GuildMemberController extends Controller {

    /**
     * @var GuildMember
     */
    private $guildMember;

    /**
     * @var GuildMemberRole
     */
    private $guildMemberRole;

    public function __construct(GuildMember $member, GuildMemberRole $role) {
        $this->guildMember = $member;
        $this->guildMemberRole = $role;
    }


    public function create(Request $request) {
        $request->validate([
            'server_id' => 'required',
            'user_id' => 'required',
            'user_name' => 'required',
            'user_discrim' => 'required'
        ]);
        return $this->guildMember->create($request->all());
    }

    public function get($server, $id) {
        return $this->guildMember->whereUserId($id)->whereServerId($server)->with('roles')->firstOrFail();
    }

    public function getForServer($server) {
        return $this->guildMember->whereServerId($server)->with('roles')->get();
    }

    public function update(Request $request, $server, $id) {
        $member = $this->guildMember->whereUserId($id)->whereServerId($server)->first();
        $member->fill($request->all());
        $member->save();
        return $member;
    }

    public function delete($server, $id) {
        return response()->json(['success' => $this->guildMember->whereUserId($id)->whereServerId($server)->first()->delete()]);
    }

    public function addRole($member, Role $role) {
        return $this->guildMemberRole->updateOrCreate(['user_id' => $member, 'server_id' => $role->server_id, 'role_id' => $role->id], [
            'server_id' => $role->server_id,
            'user_id' => $member,
            'role_id' => $role->id
        ]);
    }

    public function removeRole($member, Role $role) {
        return json_encode(['success' => (bool)$this->guildMemberRole->whereRoleId($role->id)->whereUserId($member)->first()->delete()]);
    }
}
