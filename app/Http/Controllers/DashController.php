<?php

namespace App\Http\Controllers;

use App\Models\Guild;
use Illuminate\Http\Request;
use Intervention\Image\AbstractFont;
use Redis;
use Response;

class DashController extends Controller
{
    public function displayOverview(Request $request)
    {
        if (\Auth::guest()) {
            return redirect(route('login') . '?returnUrl=' . urlencode($request->getRequestUri()));
        }
        $sub = \DB::table('server_permissions')->where('user_id', '=', \Auth::id())->select('server_id as id',
            'name', 'icon_id')->join('guild', 'server_id', '=', 'guild.id')->whereNull('guild.deleted_at');
        $servers = \DB::table('guild')->where('owner', '=', \Auth::id())->whereNull('deleted_at')->select([
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
        $server->load('settings');
        \JavaScript::put([
            'Server' => $server
        ]);
        return view('layouts.dashboard')->with([
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
}
