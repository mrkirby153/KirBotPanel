<?php


namespace App\Http\Controllers\Dashboard;


use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\Role;
use App\Models\Server;
use App\Utils\AuditLogger;
use App\Utils\DiscordAPI;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Intervention\Image\AbstractFont;

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

    public function showDashboard(Server $server) {
        $this->authorize('view', $server);
        $server->load('channels');
        \JavaScript::put([
            'Server' => $server
        ]);
        return view('server.dashboard.general')->with(['tab' => 'general', 'server' => $server,
            'textChannels' => $this->getTextChannelsFromBot($server->id), 'roles' => Role::whereServerId($server->id)->get()]);
    }


    public function setRealnameSettings(Server $server, Request $request) {
        $this->authorize('update', $server);
        $request->validate([
            'realnameSetting' => 'required',
            'requireRealname' => 'required|boolean'
        ]);
        $server->realname = $request->get('realnameSetting');
        $server->require_realname = ($request->get('realnameSetting') == 'OFF') ? false : $request->get('requireRealname');
        $server->save();
        AuditLogger::log($server->id, "realname_update", ['enabled' => $request->realnameSetting, 'required' => $request->requireRealname]);
        Redis::publish('kirbot:update-name', json_encode(['server' => $server->id]));
    }

    public function updateLogging(Server $server, Request $request) {
        $this->authorize('update', $server);
        $request->validate([
            'enabled' => 'required|boolean'
        ]);
        if ($request->channel == null && $request->enabled) {
            $request->validate([
                'channel' => 'required'
            ]);
        }
        $server->log_channel = $request->get('enabled') ? $request->get('channel') : null;
        $server->save();
        AuditLogger::log($server->id, "log_channel", ['enabled' => $request->get('enabled'), 'channel' => $request->get('enabled') ? $request->get('channel') : null]);
        return $server;
    }

    public function updateChannelWhitelist(Server $server, Request $request) {
        $this->authorize('update', $server);
        $whitelist = $request->get('channels');
        $server->cmd_whitelist = $whitelist;
        $server->save();
        AuditLogger::log($server->id, "command_whitelist_update", ['channels' => $request->get('channels')]);
        return $server;
    }

    public function updateBotManagers(Server $server, Request $request) {
        $this->authorize('update', $server);
        $server->bot_manager = $request->get('roles');
        $server->save();
        AuditLogger::log($server->id, "bot_manager_update", ['roles' => $request->get('roles')]);
        return $server;
    }

    public function showCommandList(Server $server) {
        return view('server.commandlist')->with(['commands' => $server->commands, 'server' => $server]);
    }

    public function showLog(Server $server) {
        $this->authorize('view', $server);
        $logData = Log::whereServerId($server->id)->orderBy('created_at', 'desc')->paginate(10);
        return view('server.dashboard.log')->with(['logData' => $logData, 'tab' => 'log', 'server' => $server]);
    }

    public function showQuotes(Server $server) {
        return view('server.quotes')->with(['quotes' => $server->quotes, 'server' => $server]);
    }

    public function setPersistence(Server $server, Request $request){
        $this->authorize('update', $server);
        $server->user_persistence = $request->get('persistence') == true;
        $server->save();
    }

    public function setUsername(Server $server, Request $request) {
        $this->authorize('update', $server);
        if ($request->has('name'))
            $server->bot_nick = $request->get('name');
        else
            $server->bot_nick = "";
        $server->save();
        Redis::publish('kirbot:nickname', \GuzzleHttp\json_encode([
            'nickname' => !$request->has('name') ? null : $request->get('name'),
            'server' => $server->id]));
    }

    public function makeIcon(Request $request) {
        $serverName = $request->get('server_name');
        $words = explode(" ", $serverName);
        $acronym = "";
        foreach ($words as $word) {
            $acronym .= $word[0];
        }

        $img = \Image::canvas(290, 290, '#7289DA');
        $img->text($acronym, 290 / 2, 290 / 2, function (AbstractFont $font) {
            $font->file(public_path('Whitney-Book.ttf'));
            $font->color("#FFFFFF");
            $font->size(130);
            $font->align('center');
            $font->valign('middle');
        });
        return $img->response();
    }
}