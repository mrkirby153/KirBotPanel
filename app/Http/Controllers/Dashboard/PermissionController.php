<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Models\ServerPermission;
use Illuminate\Http\Request;

class PermissionController extends Controller {

    /**
     * @var ServerPermission
     */
    private $permissions;

    public function __construct(ServerPermission $permission) {
        $this->permissions = $permission;
    }

    public function showPane(Server $server) {
        $this->authorize('view', $server);
        $results = $this->getPermissions($server);
        \JavaScript::put([
            'Permissions' => $results,
            'Server' => $server,
            'UserId' => \Auth::id()
        ]);
        return view('server.dashboard.permissions')->with(['server' => $server, 'tab' => 'permissions']);
    }

    private function getPermissions(Server $server) {
        return \DB::table($this->permissions->getTable())->select([
            'server_permissions.id', 'server_permissions.user_id', 'server_permissions.permission',
            'guild_members.user_name', 'guild_members.user_discrim'])
            ->leftJoin('guild_members', 'server_permissions.user_id', '=', 'guild_members.user_id')
            ->where('server_permissions.server_id', $server->id)->distinct()->orderBy('server_permissions.user_id', 'desc')->get();
    }

    public function update(Request $request, Server $server, ServerPermission $permission) {
        $this->authorize('update', $server);
        $permission->permission = $request->get('permission', 'VIEW');
        $permission->save();
        return $this->getPermissions($server);
    }

    public function delete(Server $server, ServerPermission $permission) {
        $this->authorize('update', $server);
        $permission->delete();
        return $this->getPermissions($server);
    }

    public function create(Request $request, Server $server){
        $this->authorize('update', $server);
        $request->validate([
            'userId' => 'required|numeric',
            'permission' => 'required'
        ]);

        $permission = new ServerPermission();
        $permission->user_id = $request->get('userId');
        $permission->server_id = $server->id;
        $permission->permission = $request->get('permission');
        $permission->save();
        return $this->getPermissions($server);
    }
}
