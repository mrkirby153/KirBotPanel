<?php

namespace App\Policies;

use App\ServerSettings;
use App\User;
use App\Utils\DiscordAPI;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServerPolicy {
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the serverSettings.
     *
     * @param  \App\User $user
     * @param  \App\ServerSettings $serverSettings
     * @return mixed
     */
    public function view(User $user, ServerSettings $serverSettings) {
        $server = DiscordAPI::getServerById($user, $serverSettings->id);
        if ($server == null)
            return false;
        else
            return $server->permissions & 32 > 0;
    }

    /**
     * Determine whether the user can create serverSettings.
     *
     * @param  \App\User $user
     * @return mixed
     */
    public function create(User $user) {
        return false;
    }

    /**
     * Determine whether the user can update the serverSettings.
     *
     * @param  \App\User $user
     * @param  \App\ServerSettings $serverSettings
     * @return mixed
     */
    public function update(User $user, ServerSettings $serverSettings) {
        $server = DiscordAPI::getServerById($user, $serverSettings->id);
        if ($server == null)
            return false;
        else
            return $server->permissions & 32 > 0;
    }

    /**
     * Determine whether the user can delete the serverSettings.
     *
     * @param  \App\User $user
     * @param  \App\ServerSettings $serverSettings
     * @return mixed
     */
    public function delete(User $user, ServerSettings $serverSettings) {
        return false;
    }
}
