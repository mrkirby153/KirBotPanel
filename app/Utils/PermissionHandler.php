<?php


namespace App\Utils;


use App\Models\ServerPermission;
use App\User;

class PermissionHandler {

    public static function canEdit(User $user, $serverId) {
        if(\Auth::user()->admin)
            return true;
        $server = DiscordAPI::getServerById($user, $serverId);
        if ($server->owner)
            return true;
        else {
            $perm = ServerPermission::whereServerId($serverId)->whereUserId(\Auth::id())->first();
            if($perm == null)
                return false;
            return $perm->permission == "EDIT";
        }
    }

    public static function canView(User $user, $serverId) {
        if(self::canEdit($user, $serverId))
            return true;
        $server = DiscordAPI::getServerById($user, $serverId);
        if ($server->owner)
            return true;
        else {
            $perm = ServerPermission::whereServerId($serverId)->whereUserId(\Auth::id())->first();
            if($perm == null)
                return false;
            return $perm->permission == "VIEW";
        }
    }
}