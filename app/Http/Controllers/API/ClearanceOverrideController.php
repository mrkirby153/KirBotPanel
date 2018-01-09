<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ClearanceOverride;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ClearanceOverrideController extends Controller {

    public function getOverrides(Server $server) {
        return response()->json($server->overrides);
    }

    public function createOverride(Server $server, Request $request) {
        $request->validate([
            'command' => 'required',
            'clearance' => 'required'
        ]);
        return response()->json($server->overrides()->updateorCreate([
            'command' => $request->get('command'),
            'server_id' => $server->id],
            $request->all()));
    }

    public function deleteOverride(ClearanceOverride $override) {
        $override->delete();
        return response()->json([]);
    }
}
