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
        $this->authorize('view', $server);
        if ($request->expectsJson()) {
            return response()->json($server->commands);
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
            'clearance' => 'required|numeric|between:0,100',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
        $exist = CustomCommand::whereName($request->name)->whereServer($server->id)->first();
        if ($exist->id != $command->id) {
            return response()->json(['name' => ['A command already exists with that name on the server']], 422);
        }
        $command->name = $request->name;
        $command->data = $request->description;
        $command->clearance_level = $request->clearance;
        $command->respect_whitelist = $request->respect_whitelist;
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
    }


    public function createCommand(Server $server, Request $request) {
        $this->authorize('update', $server);
        $this->validate($request, [
            'name' => 'required|max:255|without_spaces',
            'description' => 'required',
            'clearance' => 'required|numeric|between:0,100',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);
        if (CustomCommand::whereName($request->name)->whereServer($server->id)->count() > 0) {
            return response()->json(['name' => 'A command already exists with that name on this server!'], 422);
        }
        $cmd = new CustomCommand();
        $cmd->name = strtolower($request->name);
        $cmd->server = $server->id;
        $cmd->clearance_level = $request->clearance;
        $cmd->data = $request->description;
        $cmd->save();
        return $cmd;
    }

    public function deleteCommand(Server $server, $command) {
        $this->authorize('update', $server);
        CustomCommand::destroy($command);
        syncServer($server->id);
    }

}