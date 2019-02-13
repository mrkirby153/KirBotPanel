<?php


namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\CommandAlias;
use App\Models\CustomCommand;
use App\Models\Guild;
use App\Models\Server;
use App\Utils\AuditLogger;
use App\Utils\SettingsRepository;
use Illuminate\Http\Request;

class CommandController extends Controller
{
    public function showCommands(Guild $server, Request $request)
    {
        $this->authorize('view', $server);
        $commands = CustomCommand::whereServer($server->id)->get();
        if ($request->expectsJson()) {
            return response()->json($commands);
        }
        \JavaScript::put([
            'Server' => $server,
            'Commands' => $commands,
            'CommandAliases' => CommandAlias::whereServerId($server->id)->get()
        ]);
        return view('server.dashboard.commands')->with(['server' => $server, 'tab' => 'commands']);
    }

    public function updateCommand(Guild $server, CustomCommand $command, Request $request)
    {
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

    public function updateDiscrim(Guild $server, Request $request)
    {
        $this->authorize('update', $server);
        $this->validate($request, [
            'discriminator' => 'required'
        ]);
        SettingsRepository::set($server, "command_discriminator", $request->input('discriminator'));
    }

    public function updateSilent(Guild $server, Request $request) {
        $this->authorize('update', $server);
        $this->validate($request, [
            'silent' => 'required|boolean'
        ]);
        SettingsRepository::set($server, "command_silent_fail", $request->input('silent'));
        $server->save();
    }


    public function createCommand(Guild $server, Request $request)
    {
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

    public function deleteCommand(Guild $server, $command)
    {
        $this->authorize('update', $server);
        CustomCommand::destroy($command);
        syncServer($server->id);
    }

    public function createAlias(Guild $server, Request $request)
    {
        $this->authorize('update', $server);
        $this->validate($request, [
            'command' => 'required|max:255|without_spaces|unique:command_aliases',
            'alias' => 'without_spaces',
            'clearance' => 'required|numeric',
        ], [
            'validation.without_spaces' => 'Spaces are not allowed in command names'
        ]);

        $command = new CommandAlias();
        $command->command = $request->get('command');
        $command->alias = $request->get('alias');
        $command->clearance = $request->get('clearance');
        $command->server_id = $server->id;
        $command->save();

        syncServer($server->id);
        return $command;
    }

    public function deleteAlias(Guild $server, $alias)
    {
        CommandAlias::destroy($alias);
        syncServer($server->id);
        return CommandAlias::whereServerId($server->id)->get();
    }
}
