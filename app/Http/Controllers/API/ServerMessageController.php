<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\ServerMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ServerMessageController extends Controller {

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        \Log::info($request);
        $msg = new ServerMessage();
        $msg->server_id = $request->get('server');
        $msg->id = $request->get('id');
        $msg->channel = $request->get('channel');
        $msg->author = $request->get('author');
        $m = $request->get('message');
        $msg->message = (strlen($m) > 0)? $m : "";
        $msg->save();
        return response()->json($msg, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ServerMessage $serverMessage
     * @return \Illuminate\Http\Response
     */
    public function show(ServerMessage $serverMessage) {
        return response()->json($serverMessage);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\ServerMessage $serverMessage
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ServerMessage $serverMessage) {
        $original = ServerMessage::whereId($serverMessage->id)->first();
        $serverMessage->message = $request->get('message');
        $serverMessage->save();
        return response()->json($original);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ServerMessage $serverMessage
     * @return \Illuminate\Http\Response
     */
    public function destroy($serverMessage) {
        $serverMessage = ServerMessage::whereId($serverMessage)->first();
        if ($serverMessage != null)
            $serverMessage->delete();
        return response()->json($serverMessage);
    }

    public function bulkDelete(Request $request){
        ServerMessage::destroy(explode(',', $request->get('messages')));
    }
}
