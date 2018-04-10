<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;

class InternalAPI
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
        $token = $request->header('api-token', null);
        if ($token != env('INTERNAL_API_KEY')) {
            return \Response::json(['error' => 'Invalid API key'], 401);
        }
        $response = $next($request);
        if ($response instanceof JsonResponse) {
            $success = $response->exception == null && ($response->getStatusCode() >= 200 && $response->getStatusCode() <= 299);
            $response = [
                'success' => $success,
                'data' => empty($response->getContent()) ? (object)[] : $response->getData()
            ];
            return $response;
        } else {
            return $response;
        }
    }
}
