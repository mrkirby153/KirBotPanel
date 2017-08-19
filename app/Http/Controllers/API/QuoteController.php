<?php


namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use App\Quote;
use App\ServerSettings;
use Illuminate\Http\Request;

class QuoteController extends Controller {


    public function save(Request $request) {
        $quote = new Quote();
        $quote->server_id = $request->get('server_id');
        $quote->user = $request->get('user');
        $quote->content = $request->get('content');
        $quote->message_id = $request->get('message_id');
        $quote->save();
        return response()->json($quote);
    }

    public function get($quoteId){
        return response()->json(Quote::whereId($quoteId)->first());
    }

    public function getServerQuotes(ServerSettings $server){
        return response()->json(['quotes'=>$server->quotes]);
    }

}