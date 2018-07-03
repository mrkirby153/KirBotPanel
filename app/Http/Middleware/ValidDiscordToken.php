<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;

class ValidDiscordToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (\Auth::guest()) {
            return redirect(route('login') . '?returnUrl=' . \Request::getUri());
        }
        $static = Carbon::createFromTimestamp(strtotime(\Auth::user()->expires_in));
        if ($static->isPast()) {
            return redirect(route('login') . '?returnUrl=' . \Request::getUri());
        }
        return $next($request);
    }
}
