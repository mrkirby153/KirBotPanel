<?php


namespace App\Http\Controllers\API;


use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\ServerSettings;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QuoteController extends Controller {


    public function save(Request $request) {
        $quote = new Quote();
        $quote->server_id = $request->get('server_id');
        $quote->user = $request->get('user');
        $quote->content = $request->get('content');
        $quote->message_id = $request->get('message_id');
        $quote->save();
        return response()->json($quote, Response::HTTP_CREATED);
    }

    public function get($quoteId){
        return response()->json(Quote::whereId($quoteId)->first());
    }

    public function getServerQuotes(ServerSettings $server){
        return response()->json(['quotes'=>$server->quotes]);
    }

}