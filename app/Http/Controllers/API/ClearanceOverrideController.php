<?php

namespace App\Http\Controllers\API;

use App\ClearanceOverride;
use App\ServerSettings;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ClearanceOverrideController extends Controller {

    public function getOverrides(ServerSettings $server){
        return response()->json(['overrides'=>$server->overrides]);
    }

    public function createOverride(ServerSettings $server, Request $request){
        $cmd = ClearanceOverride::whereServerId($server->id)->whereCommand($request->get('command'))->first();
        if($cmd != null){
            return $this->updateOverride($cmd, $request);
        } else {
            $override = new ClearanceOverride();
            $override->server_id = $server->id;
            $override->command = $request->get('command');
            $override->clearance = $request->get('clearance');
            $override->save();
            return $override;
        }
    }

    public function updateOverride(ClearanceOverride $override, Request $request){
        $override->clearance = $request->get('clearance');
        $override->save();
        return $override;
    }

    public function deleteOverride(ClearanceOverride $override){
        $override->delete();
    }
}
