<?php

namespace App\Http\Controllers\API;

use App\Models\ClearanceOverride;
use App\Models\Server;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class ClearanceOverrideController extends Controller {

    public function getOverrides(Server $server){
        return response()->json(['overrides'=>$server->overrides]);
    }

    public function createOverride(Server $server, Request $request){
        $request->validate([
            'command' => 'required',
            'clearance' => 'required'
        ]);
        $cmd = ClearanceOverride::whereServerId($server->id)->whereCommand($request->get('command'))->first();
        if($cmd != null){
            return $this->updateOverride($cmd, $request);
        } else {
            $override = new ClearanceOverride();
            $override->server_id = $server->id;
            $override->command = $request->get('command');
            $override->clearance = $request->get('clearance');
            $override->save();
            return response()->json($override, Response::HTTP_CREATED);
        }
    }

    public function updateOverride(ClearanceOverride $override, Request $request){
        $request->validate([
            'clearance' => 'required'
        ]);
        $override->clearance = $request->get('clearance');
        $override->save();
        return $override;
    }

    public function deleteOverride(ClearanceOverride $override){
        $override->delete();
        return response()->json([], Response::HTTP_NO_CONTENT);
    }
}
