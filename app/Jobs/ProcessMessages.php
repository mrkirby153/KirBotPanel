<?php

namespace App\Jobs;

use App\Models\Log;
use App\Models\Server;
use App\Models\ServerMessage;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Message;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Redis;

class ProcessMessages implements ShouldQueue {
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     */
    public function __construct() {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $messages = \Redis::lrange('messages', 0, Redis::llen('messages'));
        foreach($messages as $msg){
            $message = json_decode($msg);
            $m = ServerMessage::whereId($message->id)->first();
            if($m == null)
                $m = new ServerMessage();
            $m->id = $message->id;
            $m->channel = $message->channel;
            $m->message = $message->message;
            $m->author = $message->author;
            $m->server_id = $message->server;
            $m->save();
            Redis::lrem('messages', 0, $msg);
        }
    }
}
