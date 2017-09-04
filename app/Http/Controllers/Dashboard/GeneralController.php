<?php


namespace App\Http\Controllers\Dashboard;


use App\Http\Controllers\Controller;
use App\Log;
use App\Role;
use App\ServerSettings;
use App\Utils\AuditLogger;
use App\Utils\DiscordAPI;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class GeneralController extends Controller {

    public function displayOverview() {
        if (\Auth::guest()) {
            return redirect('/login?returnUrl=/servers&requireGuilds=true');
        }
        if (\Auth::user()->token_type == 'NAME_ONLY') {
            return redirect('/login?returnUrl=/servers&requireGuilds=true');
        }
        $servers = DiscordAPI::getServers(\Auth::user());
        return view('server.serverlist')->with(['servers' => $servers]);
    }

    public function showDashboard(ServerSettings $server) {
        $this->authorize('update', $server);
        $server->load('channels');
        \JavaScript::put([
            'Server' => $server
        ]);
        return view('server.dashboard.general')->with(['tab' => 'general', 'server' => $server,
            'textChannels' => $this->getTextChannelsFromBot($server->id), 'roles' => Role::whereServerId($server->id)->get()]);
    }


    public function setRealnameSettings(ServerSettings $server, Request $request) {
        $this->authorize('update', $server);
        $server->realname = $request->get('realnameSetting');
        $server->require_realname = ($request->get('realnameSetting') == 'OFF') ? false : $request->get('requireRealname');
        $server->save();
        AuditLogger::log($server, "realname_update", ['enabled' => $request->realnameSetting, 'required' => $request->requireRealname]);
        Redis::publish('kirbot:update-name', json_encode(['server' => $server->id]));
    }

    public function updateLogging(ServerSettings $server, Request $request) {
        $this->authorize('update', $server);
        if ($request->channel == null && $request->enabled) {
            return response()->json(['channel' => ['You must specify a channel to log to!']], 422);
        }
        $server->log_channel = $request->get('enabled') ? $request->get('channel') : null;
        $server->save();
        AuditLogger::log($server->id, "log_channel", ['enabled' => $request->get('enabled'), 'channel' => $request->get('enabled') ? $request->get('channel') : null]);
        return $server;
    }

    public function updateChannelWhitelist(ServerSettings $server, Request $request) {
        $this->authorize('update', $server);
        $whitelist = implode(',', $request->get('channels'));
        $server->cmd_whitelist = $whitelist;
        $server->save();
        AuditLogger::log($server->id, "command_whitelist_update", ['channels' => $request->get('channels')]);
        return $server;
    }

    public function updateBotManagers(ServerSettings $server, Request $request) {
        $this->authorize('update', $server);
        $roles = implode(',', $request->get('roles'));
        $server->bot_manager = $roles;
        $server->save();
        AuditLogger::log($server->id, "bot_manager_update", ['roles' => $request->get('roles')]);
        return $server;
    }

    public function showCommandList(ServerSettings $server) {
        $this->authorize('update', $server);
        return view('server.commandlist')->with(['commands' => $server->commands, 'server' => $server]);
    }

    public function showLog(ServerSettings $server) {
        $this->authorize('update', $server);
        $logData = Log::whereServerId($server->id)->orderBy('created_at', 'desc')->paginate(10);
        return view('server.dashboard.log')->with(['logData' => $logData, 'tab' => 'log', 'server' => $server]);
    }

    public function showQuotes(ServerSettings $server) {
        return view('server.quotes')->with(['quotes' => $server->quotes, 'server' => $server]);
    }
}