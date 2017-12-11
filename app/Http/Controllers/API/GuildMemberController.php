<?php

namespace App\Http\Controllers\API;

use App\GuildMember;
use App\Http\Controllers\Controller;
use App\Models\Log;
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
        return $this->guildMember->whereUserId($id)->whereServerId($server)->firstOrFail();
    }

    public function getForServer($server) {
        return [
            'members' => $this->guildMember->whereServerId($server)->get()
        ];
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
}
