<?php


namespace App\Http\Controllers\Dashboard;


use App\CustomCommand;
use App\Http\Controllers\Controller;
use App\ServerSettings;
use App\Utils\AuditLogger;
use Illuminate\Http\Request;
use Keygen\Keygen;

class CommandController extends Controller {

    public function showCommands($server, Request $request) {
        if ($request->expectsJson()) {
            return response()->json(CustomCommand::whereServer($server)->get());
        }
        $serverById = $this->getServerById($server);
        if (($serverById->permissions & 32) <= 0) {
            return redirect('/servers');
        }
        $serverData = ServerSettings::whereId($server)->first();
        \JavaScript::put([
            'Server' => $serverById,
            'ServerData' => $serverData,
            'Commands' => CustomCommand::whereServer($server)->get()
        ]);
        return view('server.dashboard.commands')->with(['server' => $serverById, 'tab' => 'commands']);
    }

    public function updateCommand($server, Request $request) {
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required',
            'clearance' => 'required',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
        $cmd = CustomCommand::whereId($request->id)->first();
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        if ($cmd == null) {
            return response()->json(['id' => 'No command was found with that ID!'], 422);
        }
        $exist = CustomCommand::whereName($request->name)->whereServer($server)->first();
        if ($exist->id != $cmd->id) {
            return response()->json(['name' => 'A command already exists with that name on the server'], 422);
        }
        $cmd->name = $request->name;
        $cmd->data = $request->description;
        $cmd->clearance = $request->clearance;
        $cmd->respect_whitelist = $request->respect_whitelist;
        AuditLogger::log($server, "command_update", ['name'=>$cmd->name, 'clearance'=>$cmd->clearance, 'description'=>$request->description]);
        $cmd->save();
    }

    public function updateDiscrim($server, Request $request) {
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        ServerSettings::updateOrCreate(['id' => $server], [
            'command_discriminator' => $request->discriminator
        ]);
        AuditLogger::log($server, "discrim_update", $request->discriminator);
    }


    public function createCommand($server, Request $request) {
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required',
            'clearance' => 'required',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
        if ($this->getServerById($server) == null || ($this->getServerById($server)->permissions & 32) <= 0) {
            return response()->json(['server' => 'You do not have access to this server!'], 422);
        }
        if (CustomCommand::whereName($request->name)->whereServer($server)->count() > 0) {
            return response()->json(['name' => 'A command already exists with that name on this server!'], 422);
        }
        $cmd = new CustomCommand();
        $cmd->id = Keygen::alphanum(10)->generate();
        $cmd->name = strtolower($request->name);
        $cmd->server = $server;
        $cmd->clearance = $request->clearance;
        $cmd->data = $request->description;
        AuditLogger::log($server, "command_create", ['name'=>$cmd->name, 'clearance'=>$cmd->clearance, 'data'=>$cmd->data]);
        $cmd->save();
    }

    public function deleteCommand($server, $command) {
        AuditLogger::log($server, "command_destroy", ['name'=>CustomCommand::whereId($command)->first()->name]);
        CustomCommand::destroy($command);
    }

}