<?php

namespace App\Policies;

use App\Models\Server;
use App\User;
use App\Utils\DiscordAPI;
use App\Utils\PermissionHandler;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServerPolicy
{
    use HandlesAuthorization;


    /**
     *
     * @param $user User
     * @param $ability
     * @return bool
     */
    public function before($user, $ability)
    {
        if ($user->admin) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the serverSettings.
     *
     * @param  \App\User $user
     * @param  \App\Models\Server $serverSettings
     * @return mixed
     */
    public function view(User $user, Server $serverSettings)
    {
        return PermissionHandler::canView($user, $serverSettings->id);
    }

    /**
     * Determine whether the user can create serverSettings.
     *
     * @param  \App\User $user
     * @return mixed
     */
    public function create(User $user)
    {
        return false;
    }

    /**
     * Determine whether the user can update the serverSettings.
     *
     * @param  \App\User $user
     * @param  \App\Models\Server $serverSettings
     * @return mixed
     */
    public function update(User $user, Server $serverSettings)
    {
        return PermissionHandler::canEdit($user, $serverSettings->id);
    }

    /**
     * Determine whether the user can delete the serverSettings.
     *
     * @param  \App\User $user
     * @param  \App\Models\Server $serverSettings
     * @return mixed
     */
    public function delete(User $user, Server $serverSettings)
    {
        return false;
    }
}
