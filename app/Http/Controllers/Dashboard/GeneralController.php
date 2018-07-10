<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Infraction;
use App\Models\Log;
use App\Models\LogSetting;
use App\Models\Server;
use App\Utils\AuditLogger;
use App\Utils\DiscordAPI;
use App\Utils\PermissionHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Response;
use Intervention\Image\AbstractFont;

class GeneralController extends Controller
{
    public function displayOverview(Request $request)
    {
        if (\Auth::guest() || \Auth::user()->token_type == 'NAME_ONLY') {
            return redirect(route('login') . '?returnUrl=' . urlencode($request->getRequestUri()) . '&requireGuilds=true');
        }
        $servers = DiscordAPI::getServers(\Auth::user());
        $onServers = array();
        $notOnServers = array();
        foreach ($servers as $server) {
            if ($server->on) {
                if (PermissionHandler::canView(\Auth::user(), $server->id)) {
                    $onServers[] = $server;
                }
            } else {
                $notOnServers[] = $server;
            }
        }
        return view('server.serverlist')->with(['onServers' => $onServers, 'notOnServers' => $notOnServers]);
    }

    public function showDashboard(Server $server)
    {
        $this->authorize('view', $server);
        $server->load('channels');
        $server->load('logSettings');
        $events = Redis::get("log_events");
        if ($events == null) {
            $events = "{}";
        }
        \JavaScript::put([
            'Server' => $server,
            'LogEvents' => json_decode($events)
        ]);
        return view('server.dashboard.general')->with([
            'tab' => 'general',
            'server' => $server,
            'textChannels' => $this->getTextChannelsFromBot($server->id),
            'roles' => $server->roles
        ]);
    }


    public function setRealnameSettings(Server $server, Request $request)
    {
        $this->authorize('update', $server);
        $request->validate([
            'realnameSetting' => 'required',
            'requireRealname' => 'required|boolean'
        ]);
        $server->realname = $request->get('realnameSetting');
        $server->require_realname = ($request->get('realnameSetting') == 'OFF') ? false : $request->get('requireRealname');
        $server->save();
        Redis::publish('kirbot:update-name', json_encode(['server' => $server->id]));
    }

    public function updateLogging(Server $server, Request $request)
    {
        $this->authorize('update', $server);
        $request->validate([
            'timezone' => 'required|timezone'
        ]);
        $server->log_timezone = $request->get('timezone');
        $server->save();
        return $server;
    }

    public function updateChannelWhitelist(Server $server, Request $request)
    {
        $this->authorize('update', $server);
        $whitelist = $request->get('channels');
        $server->cmd_whitelist = $whitelist;
        $server->save();
        return $server;
    }

    public function showCommandList(Server $server)
    {
        return view('server.commandlist')->with(['commands' => $server->commands, 'server' => $server]);
    }

    public function showLog(Server $server)
    {
        $this->authorize('view', $server);
        $logData = Log::whereServerId($server->id)->orderBy('created_at', 'desc')->paginate(10);
        return view('server.dashboard.log')->with(['logData' => $logData, 'tab' => 'log', 'server' => $server]);
    }

    public function showQuotes(Server $server)
    {
        return view('server.quotes')->with(['quotes' => $server->quotes, 'server' => $server]);
    }

    public function setPersistence(Server $server, Request $request)
    {
        $this->authorize('update', $server);
        $server->user_persistence = $request->get('persistence') == true;
        $server->save();
    }

    public function setUsername(Server $server, Request $request)
    {
        $this->authorize('update', $server);
        if ($request->has('name')) {
            $server->bot_nick = $request->get('name');
        } else {
            $server->bot_nick = "";
        }
        $server->save();
        Redis::publish('kirbot:nickname', \GuzzleHttp\json_encode([
            'nickname' => !$request->has('name') ? null : $request->get('name'),
            'server' => $server->id
        ]));
    }

    public function showInfractions(Server $server)
    {
        $this->authorize('view', $server);
        $infractions = Infraction::with([
            'issuedBy' => function ($q) use ($server) {
                $q->where('server_id', '=', $server->id);
            },
            'user' => function ($q) use ($server) {
                $q->where('server_id', '=', $server->id);
            }
        ])->where('guild', $server->id)->get();
        return view('server.dashboard.infractions')->with([
            'infractions' => $infractions,
            'server' => $server,
            'tab' => 'infractions'
        ]);
    }

    public function makeIcon(Request $request)
    {
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

    public function showArchived($key)
    {
        $data = Redis::get("archive:$key");
        if ($data == null) {
            return response('Archive not found or expired', 404);
        }
        if (starts_with($data, "e:")) {
            $data = decrypt(substr($data, 2));
        }
        $response = Response::make($data, 200);
        $response->header('Content-Type', 'text/plain');
        $response->header('TTL', Redis::ttl("archive:$key"));
        return $response;
    }

    public function createLogSetting(Request $request, Server $server)
    {
        $this->authorize('update', $server);
        $request->validate([
            'channel' => 'required|exists:channels,id'
        ]);
        $settings = $server->logSettings()->create([
            'channel_id' => $request->get('channel'),
            'included' => 0,
            'excluded' => 0,
        ]);
        $settings->load('channel');
        return $settings;
    }

    public function deleteLogSetting(Server $server, LogSetting $setting)
    {
        $this->authorize('update', $server);
        $setting->delete();
    }

    public function updateLogSetting(Request $request, Server $server, LogSetting $setting)
    {
        $request->validate([
            'included' => 'array',
            'excluded' => 'array'
        ]);
        $included = 0;
        $excluded = 0;
        foreach ($request->get('included') as $e) {
            $included = $included | ((int)$e);
        }
        foreach ($request->get('excluded') as $e) {
            $excluded = $excluded | ((int)$e);
        }

        $setting->included = $included;
        $setting->excluded = $excluded;
        $setting->save();
        return $setting;
    }
}
