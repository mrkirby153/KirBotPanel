<?php

namespace App\Http\Controllers;

use App\Models\CommandAlias;
use App\Models\CustomCommand;
use App\Models\Guild;
use App\Models\LogSetting;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\ServerPermission;
use App\Utils\SettingsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\Rule;

class ApiController extends Controller
{

    public static $valid_settings = [
        'persist_roles',
        'user_persistence',
        'cmd_whitelist',
        'starboard_enabled',
        'starboard_channel_id',
        'starboard_enabled',
        'starboard_gild_count',
        'starboard_self_star',
        'starboard_star_count',
        'quotes_enabled',
        'command_prefix'
    ];

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getCurrentUser()
    {
        return \Auth::user();
    }

    public function getLogEvents()
    {
        $events = Redis::get('log_events');
        return response()->json(json_decode($events));
    }

    public function getLogSettings(Guild $guild)
    {
        $this->authorize('view', $guild);
        return LogSetting::whereServerId($guild->id)->get();
    }

    public function updateLogSettings(Request $request, Guild $guild, LogSetting $settings)
    {
        $this->authorize('update', $guild);
        $settings->included = $request->input('include');
        $settings->excluded = $request->input('exclude');
        $settings->save();
        return $settings;
    }

    public function deleteLogSettings(Guild $guild, LogSetting $settings)
    {
        $this->authorize('update', $guild);
        return $settings->delete() ? "true" : "false";
    }

    public function createLogSettings(Request $request, Guild $guild)
    {
        $this->authorize('update', $guild);
        return LogSetting::create([
            'server_id' => $guild->id,
            'channel_id' => $request->input('channel'),
            'included' => 0,
            'excluded' => 0
        ])->load('channel');
    }

    public function setBotNick(Request $request, Guild $guild)
    {
        $this->authorize('update', $guild);
        $request->validate([
            'nick' => 'max:32'
        ]);
        SettingsRepository::set($guild, 'bot_nick', $request->input('nick'));
    }

    public function setMutedRole(Request $request, Guild $guild)
    {
        $this->authorize('update', $guild);
        SettingsRepository::set($guild, 'muted_role', $request->input('role'));
    }

    public function apiSetting(Request $request, Guild $guild)
    {
        $this->authorize('update', $guild);
        $request->validate([
            'key' => [
                'required',
                Rule::in(static::$valid_settings)
            ],
        ]);
        SettingsRepository::set($guild, $request->input('key'), $request->input('value'));
    }

    public function updatePanelPermission(Request $request, Guild $guild, ServerPermission $permission)
    {
        $this->authorize('update', $guild);
        $request->validate([
            'permission' => Rule::in('VIEW', 'EDIT', 'ADMIN')
        ]);
        $permission->permission = $request->input('permission');
        $permission->save();
        return $permission;
    }

    public function deletePanelPermission(Guild $guild, ServerPermission $permission)
    {
        $this->authorize('update', $guild);
        $permission->delete();
    }

    public function createPanelPermission(Request $request, Guild $guild)
    {
        $this->authorize('update', $guild);
        $request->validate([
            'id' => 'required|numeric',
            'permission' => ['required', Rule::in('VIEW', 'EDIT', 'ADMIN')]
        ]);
        $p = new ServerPermission();
        $p->server_id = $guild->id;
        $p->permission = $request->input('permission');
        $p->user_id = $request->input('id');
        $p->save();

        $seen_user = \DB::table('seen_users')->where('id', $request->input('id'))->first();

        $user = $seen_user != null ? $seen_user->username . '#' . $seen_user->discriminator : null;
        return response()->json([
            'id' => $p->id,
            'user_id' => $p->user_id,
            'permission' => $p->permission,
            'user' => $user
        ]);
    }

    public function getPanelPermissions(Guild $guild)
    {
        $this->authorize('view', $guild);
        return \DB::table('server_permissions')->select([
            'server_permissions.id',
            'server_permissions.user_id',
            'server_permissions.permission'
        ])->selectRaw('CONCAT(`seen_users`.`username`, \'#\', `seen_users`.`discriminator`) AS `user`')->leftJoin('seen_users',
            'server_permissions.user_id', '=', 'seen_users.id')->where('server_permissions.server_id',
            $guild->id)->orderBy('server_permissions.created_at')->get();
    }

    public function updateRolePermissions(Request $request, Guild $guild, RolePermission $permission)
    {
        $this->authorize('update', $guild);
        $request->validate([
            'permission' => 'required|numeric'
        ]);

        $permission->permission_level = $request->input('permission');
        $permission->save();
        return $permission;
    }

    public function deleteRolePermissions(Guild $guild, RolePermission $permission)
    {
        $this->authorize('update', $guild);
        $permission->delete();
    }

    public function createRolePermissions(Request $request, Guild $guild)
    {
        $this->authorize('update', $guild);
        $request->validate([
            'server' => 'required|exists:guild,id',
            'role_id' => 'required|exists:roles,id',
            'permission_level' => 'required|numeric'
        ]);

        $perm = new RolePermission();
        $perm->server_id = $request->input('server');
        $perm->role_id = $request->input('role_id');
        $perm->permission_level = $request->input('permission_level');
        $perm->save();

        $role = Role::whereId($request->input('role_id'))->first();

        return response()->json([
            'id' => $perm->id,
            'name' => $role->name,
            'permission_level' => $perm->permission_level,
            'role_id' => $perm->role_id,
            'server_id' => $perm->server_id
        ]);
    }

    public function getRolePermissions(Guild $guild)
    {
        return \DB::table('role_permissions')->select([
            'role_permissions.id',
            'role_permissions.server_id',
            'role_permissions.role_id',
            'role_permissions.permission_level',
            'roles.name'
        ])->leftJoin('roles', 'role_permissions.role_id', '=', 'roles.id')->where('role_permissions.server_id',
            $guild->id)->get();
    }

    public function getCustomCommands(Guild $guild)
    {
        return CustomCommand::whereServer($guild->id)->get();
    }

    public function updateCustomCommand(Request $request, Guild $guild, CustomCommand $command)
    {
        $this->authorize('update', $guild);
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required|max:2000',
            'clearance' => 'required|min:0|numeric',
            'respect_whitelist' => 'required|boolean'
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
        $command->name = $request->input('name');
        $command->data = $request->input('description');
        $command->clearance_level = $request->input('clearance');
        $command->respect_whitelist = $request->input('respect_whitelist');
        $command->save();
        return $command;
    }

    public function createCustomCommand(Request $request, Guild $guild)
    {
        $this->authorize('update', $guild);
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required|max:2000',
            'clearance' => 'required|min:0|numeric',
            'respect_whitelist' => 'required|boolean'
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);

        if (CustomCommand::whereName(strtolower($request->input('name')))->whereServer($guild->id)->exists()) {
            return response()->json(['name' => ['A command already exists with that name on this server']], 422);
        }

        $cmd = new CustomCommand();
        $cmd->name = strtolower($request->input('name'));
        $cmd->data = $request->input('description');
        $cmd->server = $guild->id;
        $cmd->clearance_level = $request->input('clearance');
        $cmd->respect_whitelist = $request->input('respect_whitelist');
        $cmd->save();
        return $cmd;
    }

    public function deleteCustomCommand(Guild $guild, CustomCommand $command)
    {
        $this->authorize('update', $guild);
        $command->delete();
    }

    public function createCommandAlias(Guild $guild, Request $request)
    {
        $this->authorize('update', $guild);
        $this->validate($request, [
            'command' => 'required|max:255|without_spaces',
            'alias' => 'without_spaces',
            'clearance' => 'required|numeric'
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);

        $existing = CommandAlias::whereCommand($request->get('command'))->whereServerId($guild->id)->first();
        if($existing != null) {
            return response() ->json(['errors' => [
                'command' => ['This alias already exists on the server']
            ]], 422);
        }

        $command = new CommandAlias();
        $command->command = $request->get('command');
        $command->alias = $request->get('alias');
        $command->clearance = $request->get('clearance');
        $command->server_id = $guild->id;
        $command->save();
        syncServer($guild->id);
        return $command;
    }

    public function deleteCommandAlias(Guild $guild, CommandAlias $alias)
    {
        $this->authorize('update', $guild);
        $alias->delete();
        syncServer($guild->id);
    }

    public function getCommandAliases(Guild $guild)
    {
        return CommandAlias::whereServerId($guild->id)->get();
    }
}
