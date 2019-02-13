<?php

namespace App\Http\Controllers;

use App\Models\Guild;
use App\Models\Server;
use App\Utils\SettingsRepository;
use DB;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('global_admin');
    }

    public function show()
    {
        return view('admin.dashboard')->with(['servers' => DB::table('guild')->paginate(30)]);
    }

    public function settings(Request $request)
    {
        if ($request->wantsJson()) {
            return Guild::get();
        }
        return view('admin.settings');
    }

    public function updateSettings(Request $request, $guild, $key)
    {
        SettingsRepository::set($guild, $key, $request->get('value'));
    }

    public function clearSettings($guild, $key) {
        SettingsRepository::delete($guild, $key);
    }
}
