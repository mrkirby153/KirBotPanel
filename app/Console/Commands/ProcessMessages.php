<?php

namespace App\Console\Commands;

use App\Models\ServerMessage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class ProcessMessages extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'panel:process';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     */
    public function __construct() {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle() {
        $messages = Redis::llen('messages');
        $this->info('Processing ' . $messages . ' queued messages....');
        if ($messages < 1)
            return;
        $bar = $this->output->createProgressBar($messages);
        $messages = Redis::lrange('messages', 0, $messages);
        foreach ($messages as $msg) {
            $message = \GuzzleHttp\json_decode($msg);
            $m = ServerMessage::whereId($message->id)->first();
            if ($m == null) {
                $m = new ServerMessage();
            }
            $m->id = $message->id;
            $m->channel = $message->channel;
            $m->message = $message->message;
            $m->author = $message->author;
            $m->server_id = $message->server;
            $m->save();
            $bar->advance();
            Redis::lrem('messages', 0, $msg);
        }
        $bar->finish();
    }
}
