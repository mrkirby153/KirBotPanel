<?php

namespace App\Http\Controllers;

use App\Models\Guild;
use App\Models\LogSetting;
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
        'quotes_enabled'
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

    public function updatePanelPermission(Request $request, Guild $guild, ServerPermission $permission) {
        $this->authorize('update', $guild);
        $request->validate([
            'permission' => Rule::in('VIEW', 'EDIT', 'ADMIN')
        ]);
        $permission->permission = $request->input('permission');
        $permission->save();
        return $permission;
    }

    public function deletePanelPermission(Guild $guild, ServerPermission $permission) {
        $this->authorize('update', $guild);
        $permission->delete();
    }

    public function createPanelPermission(Request $request, Guild $guild) {
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

        $user = $seen_user != null? $seen_user->username .'#' . $seen_user->discriminator : null;
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
}
