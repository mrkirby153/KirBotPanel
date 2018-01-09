<?php


namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\Server;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QuoteController extends Controller {

    /**
     * @var Quote
     */
    private $quote;

    public function __construct(Quote $quote) {
        $this->quote = $quote;
    }


    public function save(Request $request) {
        $request->validate([
            'server_id' => 'required|exists:server_settings,id',
            'user' => 'required',
            'content' => 'required',
            'message_id' => 'required'
        ]);
        return response()->json($this->quote->create($request->all()), Response::HTTP_CREATED);
    }

    public function get($quoteId) {
        return response()->json($this->quote->whereId($quoteId)->first());
    }

    public function getServerQuotes(Server $server) {
        return response()->json($server->quotes);
    }

}