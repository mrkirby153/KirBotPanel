<?php


namespace App\Http\Controllers\Dashboard;


use App\Models\CustomCommand;
use App\Http\Controllers\Controller;
use App\Models\Server;
use App\Utils\AuditLogger;
use Illuminate\Http\Request;
use Keygen\Keygen;

class CommandController extends Controller {

    public function showCommands(Server $server, Request $request) {
        if ($request->expectsJson()) {
            return response()->json($server->commands);
        }
        if (!\Auth::user()->can('update', $server)) {
            return redirect('/servers');
        }
        \JavaScript::put([
            'Server' => $server,
            'Commands' => $server->commands
        ]);
        return view('server.dashboard.commands')->with(['server' => $server, 'tab' => 'commands']);
    }

    public function updateCommand(Server $server, CustomCommand $command, Request $request) {
        $this->authorize('update', $server);
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required',
            'clearance' => 'required',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
        $exist = CustomCommand::whereName($request->name)->whereServer($server->id)->first();
        if ($exist->id != $command->id) {
            return response()->json(['name' => ['A command already exists with that name on the server']], 422);
        }
        $command->name = $request->name;
        $command->data = $request->description;
        $command->clearance = $request->clearance;
        $command->respect_whitelist = $request->respect_whitelist;
        AuditLogger::log($server->id, "command_update", ['name'=>$command->name, 'clearance'=>$command->clearance, 'description'=>$request->description]);
        $command->save();
        return $command;
    }

    public function updateDiscrim(Server $server, Request $request) {
        $this->authorize('update', $server);
        $this->validate($request, [
            'discriminator' => 'required'
        ]);
        $server->command_discriminator = $request->discriminator;
        $server->save();
        AuditLogger::log($server->id, "discrim_update", ['discriminator'=>$request->discriminator]);
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