<?php

namespace App\Http\Controllers;

use App\Models\Guild;
use App\Utils\SettingsRepository;
use Illuminate\Http\Request;

class AdminApiController extends Controller
{

    public function getGuilds()
    {
        return Guild::get()->load('settings');
    }

    public function setData(Request $request) {
        $guild = $request->input('guild');
        $key = $request->input('key');
        $value = $request->input('value');
        SettingsRepository::set($guild, $key, $value);
        return Guild::get()->load('settings');
    }
}
