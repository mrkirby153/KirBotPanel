<?php


namespace App\Http\Controllers\Dashboard;


use App\CustomCommand;
use App\Http\Controllers\Controller;
use App\ServerSettings;
use Illuminate\Http\Request;

class GeneralController extends Controller {
    public function displayOverview(Request $request) {
        $servers = $this->getServers();
        return view('server.serverlist')->with(['servers' => $servers]);
    }

    public function showDashboard($server) {
        $serverById = $this->getServerById($server);
        if (($serverById->permissions & 32) <= 0) {
            return redirect('/servers');
        }
        $serverData = ServerSettings::whereId($server)->with('channels')->first();
        \JavaScript::put([
            'Server' => $serverById,
            'ServerData' => $serverData
        ]);
        return view('server.dashboard.general')->with(['server' => $serverById, 'tab' => 'general', 'serverData'=>$serverData]);
    }



    public function setRealnameSettings($server, Request $request) {
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        ServerSettings::updateOrCreate(['id' => $server], [
            'id' => $server,
            'realname' => $request->realnameSetting,
            'require_realname' => ($request->realnameSetting == 'OFF') ? false : $request->requireRealname
        ]);
    }

    public function updateLogging($server, Request $request){
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        if($request->channel == null && $request->enabled){
            return response()->json(['error'=>'You must specify a channel to log to!'], 422);
        }
        ServerSettings::updateOrCreate(['id'=>$server], [
            'id' => $server,
            'log_channel' => $request->enabled? $request->channel : null
        ]);
    }

    public function showCommandList($server) {
        $customCommands = CustomCommand::whereServer($server)->get();
        $server = ServerSettings::whereId($server)->first();
        return view('server.commandlist')->with(['commands' => $customCommands, 'server'=>$server]);
    }
}