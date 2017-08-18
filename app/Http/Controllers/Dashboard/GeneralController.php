<?php


namespace App\Http\Controllers\Dashboard;


use App\CustomCommand;
use App\Http\Controllers\Controller;
use App\Log;
use App\Role;
use App\ServerSettings;
use App\Utils\AuditLogger;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class GeneralController extends Controller {
    public function displayOverview(Request $request) {
        if(\Auth::guest()){
            return redirect('/login?returnUrl=/servers&requireGuilds=true');
        }
        \Log::info("Token: ".\Auth::user()->token_type);
        if(\Auth::user()->token_type == 'NAME_ONLY'){
            return redirect('/login?returnUrl=/servers&requireGuilds=true');
        }
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
        return view('server.dashboard.general')->with(['server' => $serverById, 'tab' => 'general', 'serverData'=>$serverData,
            'textChannels'=>$this->getTextChannelsFromBot($server), 'roles'=>Role::whereServerId($server)->get()]);
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
        AuditLogger::log($server, "realname_update", ['enabled'=>$request->realnameSetting, 'required'=>$request->requireRealname]);
        Redis::publish('kirbot:update-name', json_encode(['server'=>$server]));
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
        AuditLogger::log($server, "log_channel", ['enabled'=>$request->enabled, 'channel'=>$request->enabled? $request->channel : null]);
    }

    public function updateChannelWhitelist($server, Request $request){
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        $whitelist = implode(',', $request->get('channels'));
        ServerSettings::updateOrCreate(['id'=>$server], [
            'id'=>$server,
            'cmd_whitelist'=> $whitelist
        ]);
        AuditLogger::log($server, "command_whitelist_update", ['channels'=>$request->get('channels')]);
    }

    public function updateBotManagers($server, Request $request){
        $roles = implode(',', $request->get('roles'));
        ServerSettings::updateOrCreate(['id'=>$server], [
            'id'=>$server,
            'bot_manager' => $roles
        ]);
        AuditLogger::log($server, "bot_manager_update", ['roles'=>$request->get('roles')]);
    }

    public function showCommandList($server) {
        $customCommands = CustomCommand::whereServer($server)->get();
        $server = ServerSettings::whereId($server)->first();
        if($server == null){
            $server = new ServerSettings(['id'=>'UNKNOWN']);
            $server->name = 'Unknown Server';
        }
        return view('server.commandlist')->with(['commands' => $customCommands, 'server'=>$server]);
    }

    public function showLog($server){
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        $logData = Log::whereServerId($server)->orderBy('created_at', 'desc')->paginate(10);
        $server = ServerSettings::whereId($server)->first();
        if($server == null){
            $server = new ServerSettings(['id'=>'UNKNOWN']);
            $server->name = 'Unknown Server';
        }
        return view('server.dashboard.log')->with(['logData'=>$logData, 'tab'=>'log', 'server'=>$server]);
    }
}