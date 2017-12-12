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
        $messages = Redis::lLen("messages");
        $this->info('Processing ' . $messages . ' queued messages....');
        if ($messages < 1)
            return;
        $bar = $this->output->createProgressBar($messages);
        $messages = Redis::lRange('messages', 0, $messages);
        foreach($messages as $msg){
            $message = \GuzzleHttp\json_decode(\Redis::get($msg));
            ServerMessage::updateOrCreate(['id' => $message->id], [
                'id' => $message->id,
                'channel' => $message->channel,
                'message' => $message->message,
                'author' => $message->author,
                'server_id' => $message->server
            ]);
            $bar->advance();
            Redis::lrem('messages', 0, $msg);
            Redis::del($msg);
        }
        $bar->finish();
    }
}
