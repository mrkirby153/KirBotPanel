<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\CustomCommand;
use App\Models\Guild;
use App\Models\Infraction;
use App\Models\Log;
use App\Models\LogSetting;
use App\Models\Quote;
use App\Models\Server;
use App\Models\Starboard;
use App\Utils\AuditLogger;
use App\Utils\Redis\RedisMessage;
use App\Utils\RedisMessenger;
use App\Utils\SettingsRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Response;
use Intervention\Image\AbstractFont;

class GeneralController extends Controller
{
    public function displayOverview(Request $request)
    {
        if (\Auth::guest()) {
            return redirect(route('login') . '?returnUrl=' . urlencode($request->getRequestUri()));
        }
        $sub = \DB::table('server_permissions')->where('user_id', '=', \Auth::id())->select('server_id as id',
            'name', 'icon_id')->join('guild', 'server_id', '=', 'guild.id');
        $servers = \DB::table('guild')->where('owner', '=', \Auth::id())->select([
            'id',
            'name',
            'icon_id'
        ])->union($sub)->get();
        return view('server.serverlist')->with(['servers' => $servers]);
    }

    public function redirectToAddUrl()
    {
        return redirect('https://discordapp.com/oauth2/authorize?client_id=' . env('DISCORD_KEY') . '&permissions=' . env('DISCORD_PERMISSIONS',
                8) . '&scope=bot');
    }

    public function showDashboard(Guild $server)
    {
        $this->authorize('view', $server);
        $server->load('channels');
        $server->load('roles');
        $server['readonly'] = !\Auth::user()->can('update', $server);
        $server['owner'] = $server->owner == \Auth::id();
        $server['admin'] = \Auth::user()->can('admin', $server);
        \JavaScript::put([
            'Server' => $server
        ]);
        return view('layouts.dashboard')->with([
            'server' => $server
        ]);
    }

    public function updateLogging(Guild $server, Request $request)
    {
        $this->authorize('update', $server);
        $request->validate([
            'timezone' => 'required|timezone'
        ]);
        SettingsRepository::set($server, "log_timezone", $request->input('timezone'));
        $server->save();
        return $server;
    }

    public function updateChannelWhitelist(Guild $server, Request $request)
    {
        $this->authorize('update', $server);
        $whitelist = $request->get('channels');
        SettingsRepository::set($server, "cmd_whitelist", $whitelist);
        return $server;
    }

    public function updateMutedRole(Guild $server, Request $request)
    {
        $this->authorize('update', $server);
        SettingsRepository::set($server, 'muted_role', $request->get('muted_role'));
        return $server;
    }

    public function showCommandList(Guild $server)
    {
        return view('server.commandlist')->with(['commands' => CustomCommand::whereServer($server->id)->get(), 'server' => $server]);
    }

    public function showQuotes(Guild $server)
    {
        return view('server.quotes')->with(['quotes' => Quote::whereServerId($server->id)->get(), 'server' => $server]);
    }

    public function setPersistence(Guild $server, Request $request)
    {
        $this->authorize('update', $server);
        SettingsRepository::set($server, 'user_persistence', $request->get('mode'));
        SettingsRepository::set($server, 'persist_roles', $request->get('roles'));
        $server->save();
    }

    public function setUsername(Guild $server, Request $request)
    {
        $this->authorize('update', $server);
        SettingsRepository::set($server, 'bot_nick', $request->get('name'));
    }

    public function showInfractions(Guild $server)
    {
        $this->authorize('view', $server);
        \JavaScript::put([
            'Server' => $server
        ]);
        return view('server.dashboard.infractions')->with([
            'server' => $server,
            'tab' => 'infractions'
        ]);
    }

    public function retrieveInfractions(Request $request, Guild $server)
    {
        $map = [
            'id' => 'id',
            'uid' => 'user_id',
            'mid' => 'issuer'
        ];
        $this->authorize('view', $server);
        $builder = Infraction::whereGuild($server->id);
        foreach ($map as $k => $v) {
            $builder = $builder->where($v, 'LIKE', '%' . $request->get($k, '') . '%');
        }
        $builder->orderBy('id', 'desc');
        return $builder->paginate();
    }

    public function showInfraction(Guild $server, Infraction $infraction)
    {
        if ($infraction->guild !== $server->id) {
            abort(404);
        }
        return view('server.dashboard.infraction')->with([
            'infraction' => $infraction,
            'tab' => 'infractions',
            'server' => $server
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

    public function createLogSetting(Request $request, Guild $server)
    {
        $this->authorize('update', $server);
        $request->validate([
            'channel' => 'required|exists:channels,id'
        ]);
        $ls = new LogSetting();
        $ls->channel_id = $request->get('channel');
        $ls->included = 0;
        $ls->excluded = 0;
        $ls->server_id = $server->id;
        $ls->save();
        $ls->load('channel');
        return $ls;
    }

    public function deleteLogSetting(Guild $server, LogSetting $setting)
    {
        $this->authorize('update', $server);
        $setting->delete();
    }

    public function updateLogSetting(Request $request, Guild $server, LogSetting $setting)
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

    public function updateStarboard(Request $request, Guild $guild)
    {
        $this->authorize('update', $guild);
        $data = [];
        foreach($request->all(['channel_id', 'gild_count', 'self_star', 'star_count', 'enabled']) as $k => $v) {
            $data['starboard_'.$k] = $v;
        }
        if(!$data['starboard_enabled']) {
            foreach($data as $k => $v) {
                if($k != 'starboard_enabled') {
                    $data[$k] = null;
                }
            }
        }
        SettingsRepository::setMultiple($guild, $data);
        syncServer($guild->id);
    }
}
