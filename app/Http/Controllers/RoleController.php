<?php

namespace App\Http\Controllers;

use App\Role;
use Illuminate\Http\Request;

class RoleController extends Controller {

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $role = new Role();
        $role->id = $request->get('id');
        $role->server_id = $request->get('server_id');
        $role->name = $request->get('name');
        $role->permissions = $request->get('permissions');
        $role->save();
        return response()->json($role);
    }

    /**
     * Display the specified resource.
     *
     * @param int $role
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show($role) {
        return response()->json(Role::whereId($role)->first());
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param int $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $role) {
        $role = Role::whereId($role)->first();
        if ($role == null)
            return response()->json(['error' => 'Not found'], 404);
        $role->name = $request->get('name');
        if($request->has('permissions'))
            $role->permissions = $request->get('permissions');
        $role->save();
        return response()->json($role);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $role
     * @return \Illuminate\Http\Response
     */
    public function destroy($role) {
        Role::destroy($role);
    }
}
