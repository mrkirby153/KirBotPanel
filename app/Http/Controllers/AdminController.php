<?php

namespace App\Http\Controllers;

use App\Models\Server;
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
        return view('admin.dashboard')->with(['servers' => DB::table('server_settings')->paginate(30)]);
    }
}
