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

    public function __construct(GuildMember $member) {
        $this->guildMember = $member;
    }


    public function create(Request $request) {
        $request->validate([
            'server_id' => 'required',
            'user_id' => 'required',
            'user_name' => 'required',
            'user_discrim' => 'required'
        ]);
        return $this->guildMember->create(array_merge($request->all(), [
            'id' => \Keygen::alphanum(10)->generate()]));
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
        return response()->json(['success' => $this->guildMember->whereUserId($id)->whereServerId($server)->delete()]);
    }

    public function addRole($member, Role $role) {
        return GuildMemberRole::updateOrCreate(['user_id' => $member, 'server_id' => $role->server_id, 'role_id' => $role->id], [
            'server_id' => $role->server_id,
            'user_id' => $member,
            'role_id' => $role->id
        ]);
    }

    public function removeRole($member, Role $role) {
        return json_encode(['success' => (bool)GuildMemberRole::whereRoleId($role->id)->whereUserId($member)->delete()]);
    }
}
