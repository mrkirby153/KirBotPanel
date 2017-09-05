<?php


namespace App\Utils;


use App\Models\Log;

class AuditLogger {


    public static function log($server, $action, $data) {
        if($server == null)
            return;
        $log = new Log();
        if (!\Auth::guest())
            $log->acting_user = \Auth::user()->username;
        else
            $log->acting_user = "Anonymous";
        $log->action = strtoupper($action);
        $log->extra_data = json_encode($data);
        $log->server_id = $server;
        $log->save();
    }

}