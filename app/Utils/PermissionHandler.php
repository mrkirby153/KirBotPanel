<?php


namespace App\Utils;

use App\Models\Guild;
use App\Models\ServerPermission;
use App\User;

class PermissionHandler
{

    private static $guild_cache = [];

    /**
     * @param User $user
     * @param $serverId string
     * @return bool
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public static function canEdit(User $user, $serverId)
    {
        if (\Auth::user()->admin || self::isAdmin($user, $serverId)) {
            \Log::info("Admin bypass");
            return true;
        }
        return self::checkPermission($user, $serverId, 'EDIT');
    }

    /**
     * @param User $user
     * @param $serverId string
     * @return bool
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public static function canView(User $user, $serverId)
    {
        if (self::canEdit($user, $serverId)) {
            return true;
        }
        return self::checkPermission($user, $serverId, 'VIEW');
    }

    /**
     * @param User $user
     * @param $serverId string
     * @return bool
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public static function isAdmin(User $user, $serverId)
    {
        return self::checkPermission($user, $serverId, 'ADMIN');
    }

    /**
     * @param User $user
     * @param $serverId string
     * @param $permission string
     * @return bool
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private static function checkPermission(User $user, $serverId, $permission)
    {
        $guild = null;
        if (\Cache::has("guild:" . $serverId)) {
            \Log::info("cached");
            $guild = \Cache::get("guild:" . $serverId);
        } else {
            $guild = Guild::whereId($serverId)->firstOrFail();
            \Log::info("not cached");
            \Cache::put("guild:" . $serverId, $guild, 30);
        }
        if ($guild->owner == $user->id) {
            \Log::info("owner");
            return true;
        } else {
            $perm = ServerPermission::whereServerId($serverId)->whereUserId($user->id)->first();
            if ($perm == null)
                return false;
            return $perm->permission == $permission;
        }
    }
}
