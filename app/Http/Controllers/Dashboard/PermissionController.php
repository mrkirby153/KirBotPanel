<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\Server;
use App\Models\ServerPermission;
use App\Utils\DiscordAPI;
use Illuminate\Http\Request;

class PermissionController extends Controller
{

    /**
     * @var ServerPermission
     */
    private $permissions;

    private $rolePerms;

    public function __construct(ServerPermission $permission, RolePermission $rolePermission)
    {
        $this->permissions = $permission;
        $this->rolePerms = $rolePermission;
    }

    public function showPane(Server $server)
    {
        $this->authorize('view', $server);
        $results = $this->getPermissions($server);
        \JavaScript::put([
            'Admin' => \Auth::user()->can('admin', $server),
            'Permissions' => $results,
            'Server' => $server,
            'UserId' => \Auth::id(),
            'Roles' => Role::whereServerId($server->id)->orderBy('order', 'DESC')->get(),
            'Owner' => DiscordAPI::getServerById(\Auth::user(), $server->id)->owner
        ]);
        return view('server.dashboard.permissions')->with(['server' => $server, 'tab' => 'permissions']);
    }

    private function getPermissions(Server $server)
    {
        return \DB::table($this->permissions->getTable())->select([
            'server_permissions.id', 'server_permissions.user_id', 'server_permissions.permission',
            'guild_members.user_name', 'guild_members.user_discrim'])
            ->leftJoin('guild_members', 'server_permissions.user_id', '=', 'guild_members.user_id')
            ->where('server_permissions.server_id', $server->id)->distinct()->orderBy('server_permissions.user_id', 'desc')->get();
    }

    public function update(Request $request, Server $server, ServerPermission $permission)
    {
        $this->authorize('update', $server);
        $permission->permission = $request->get('permission', 'VIEW');
        $permission->save();
        return $this->getPermissions($server);
    }

    public function delete(Server $server, ServerPermission $permission)
    {
        $this->authorize('update', $server);
        $permission->delete();
        return $this->getPermissions($server);
    }

    public function create(Request $request, Server $server)
    {
        $this->authorize('update', $server);
        $request->validate([
            'userId' => 'required|numeric|unique:server_permissions,user_id',
            'permission' => 'required'
        ]);

        $permission = new ServerPermission();
        $permission->user_id = $request->get('userId');
        $permission->server_id = $server->id;
        $permission->permission = $request->get('permission');
        $permission->save();
        return $this->getPermissions($server);
    }

    public function createRolePermission(Request $request, Server $server)
    {
        $this->authorize('update', $server);
        $request->validate([
            'roleId' => 'required|numeric|exists:roles,id',
            'permissionLevel' => 'required|between:0,100|numeric'
        ]);
        $model = $this->rolePerms->create([
            'role_id' => $request->get('roleId'),
            'permission_level' => $request->get('permissionLevel'),
            'server_id' => $server->id]);
        $model['name'] = Role::whereId($request->get('roleId'))->first()->name;
        syncServer($server->id);
        return $model;
    }

    public function deleteRolePermission(Server $server, RolePermission $permission)
    {
        $this->authorize('update', $server);
        $permission->delete();
        syncServer($server->id);
    }

    public function updateRolePermission(Request $request, Server $server, RolePermission $permission)
    {
        $this->authorize('update', $server);
        $request->validate([
            'permissionLevel' => 'required|between:0,100|numeric'
        ]);

        $permission->permission_level = $request->get('permissionLevel');
        $permission->save();
        syncServer($server->id);
        return $permission;
    }

    public function getRolePermissions(Server $server)
    {
        $permissions = \DB::table($this->rolePerms->getTable())->select(['role_permissions.*', 'roles.name'])
            ->leftJoin('roles', 'role_permissions.role_id', '=', 'roles.id')
            ->where('role_permissions.server_id', $server->id)->get();

        return $permissions;
    }
}
