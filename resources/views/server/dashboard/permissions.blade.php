@extends('layouts.dashboard')

@section('panel')
    <div class="row">
        <settings-permissions inline-template>
            <div class="col-12">
                <h1>Panel Permissions</h1>
                <p>
                    Configure permissions for users here.<br/>
                    <em>The server owner always has admin permissions, regardless of what is set below</em><br/>
                </p>
                <div>
                    <b>Admin: </b>Full access to the panel, can edit and add new users <br/>
                    <b>Edit: </b>Can edit settings, but cannot add new users<br/>
                    <b>View: </b>View only access
                </div>

                <table class="table mt-1">
                    <thead class="thead-light">
                    <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Permission</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="permission in permissions" :key="permission.id">
                        <td>@{{ permission.user_id }}</td>
                        <td v-if="permission.user_name && permission.user_discrim">@{{ permission.user_name }}#@{{
                            permission.user_discrim }}
                        </td>
                        <td v-else>Unknown.</td>
                        <td>
                            <select class="form-control" :value="permission.permission"
                                    @change="updatePermission($event.target.value, permission.id)"
                                    :disabled="!owner && (!admin || permission.user_id == user)">
                                <option value="VIEW">View</option>
                                <option value="EDIT">Edit</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-danger"
                                    :disabled="!owner && (!admin || permission.user_id == user)"
                                    @click="deletePermission(permission.id)">
                                <i class="fas fa-times"></i> Delete
                            </button>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr v-if="!adding">
                        <th colspan="4">
                            <button class="btn btn-success" @click="adding = true">Add</button>
                        </th>
                    </tr>
                    <tr v-else>
                        <th colspan="4">
                            <panel-form :form="addingUser" v-show="adding" @submit="sendForm">
                                <div class="form-row">
                                    <div class="col-md-3">
                                        <field name="userId" :form="addingUser">
                                            <label for="userId">User ID</label>
                                            <input type="text" name="userId" v-model="addingUser.userId"
                                                   class="form-control" id="userId"/>
                                        </field>
                                    </div>
                                    <div class="col-md-3">
                                        <field name="permission" :form="addingUser">
                                            <label for="permission">Permission</label>
                                            <select v-model="addingUser.permission" class="form-control" id="permission" name="permission">
                                                <option value="" disabled>Select an option</option>
                                                <option value="VIEW">View</option>
                                                <option value="EDIT">Edit</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </field>
                                    </div>
                                </div>
                            </panel-form>
                                <div class="form-row">
                                    <div class="col-12">
                                        <div class="btn-group">
                                            <button class="btn btn-success" @click="sendForm"><i class="fas fa-check"></i> Save</button>
                                            <button class="btn btn-warning" @click="adding = false"><i
                                                        class="fas fa-times"></i> Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        </th>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </settings-permissions>
    </div>
@endsection