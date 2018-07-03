<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected function getChannelsFromBot($server)
    {
        /*        $client = new \GuzzleHttp\Client();
                try {
                    $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server, [
                        'connect_timeout' => $this->connect_timeout
                    ]);
                    $channels = json_decode($response->getBody());
                    return $channels != null? $channels : Channel::whereServer($server)->get();
                } catch (ConnectException $exception) {
                    return Channel::whereServer($server)->get();
                }*/
        return Channel::whereServer($server)->get();
    }

    protected function getTextChannelsFromBot($server)
    {
        /*        $client = new \GuzzleHttp\Client();
                try {
                    $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server . '/text', [
                        'connect_timeout' => $this->connect_timeout
                    ]);
                    $channels = json_decode($response->getBody());
                    return $channels != null ? $channels : Channel::whereServer($server)->whereType('TEXT')->get();
                } catch (ConnectException $exception) {
                    return Channel::whereServer($server)->whereType('TEXT')->get();
                }*/

        return Channel::whereServer($server)->whereType('TEXT')->get();
    }

    protected function getVoiceChannelsFromBot($server)
    {
        /*        $client = new \GuzzleHttp\Client();
                try {
                    $response = $client->request('GET', env('KIRBOT_URL') . 'v1/channels/' . $server . '/voice', [
                        'connect_timeout' => $this->connect_timeout
                    ]);
                    $channels = json_decode($response->getBody());
                    return $channels != null ? $channels : Channel::whereServer($server)->get();
                } catch (ConnectException $exception) {
                    return Channel::whereServer($server)->whereType('VOICE')->get();
                }*/

        return Channel::whereServer($server)->whereType('VOICE')->get();
    }
}
