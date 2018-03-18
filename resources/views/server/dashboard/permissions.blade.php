@extends('layouts.dashboard')

@section('panel')
    @php
        $color = \App\Menu\Panel::getPanelColor($tab);
    @endphp

    <div class="ui {{$color}} segment">
        <h2>Panel Permissions</h2>
        <p>Configure permissions for users here. <b>Note:</b> The server owner always has all permissions</p>
        <h2>Current Permissions</h2>
        <settings-permissions inline-template>
            <div>
                <table class="ui celled table">
                    <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Permission</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="permission in permissions" :key="permission.id">
                        <td>@{{ permission.user_id }}</td>
                        <td v-if="permission.user_name && permission.user_discrim">@{{ permission.user_name }}#@{{permission.user_discrim}}
                        </td>
                        <td v-else>Unknown! User is not in server</td>
                        <td>
                            <dropdown @change="updatePermission($event.target.value, permission.id)" :value="permission.permission"
                                    :disabled="permission.user_id === user || readonly" v-once>
                                <option value="VIEW">View Only</option>
                                <option value="EDIT">Edit</option>
                            </dropdown>
                        </td>
                        <td>
                            <button class="ui red icon button" :disabled="permission.user_id == user || readonly"
                                    @click="deletePermission(permission.id)"><i
                                        class="x icon"></i></button>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr v-if="!adding">
                        <th colspan="4">
                            <button class="ui green button" @click="adding = true" :disabled="readonly">Add</button>
                        </th>
                    </tr>
                    </tfoot>
                </table>
                <panel-form :form="addingUser" v-show="adding" @submit="sendForm">
                    <div slot="inputs">
                        <div class="two fields">
                            <field name="userId" :form="addingUser">
                                <label>User ID</label>
                                <input type="text" name="userId" v-model="addingUser.userId"/>
                            </field>
                            <field name="permission" :form="addingUser">
                                <label>Permission</label>
                                <dropdown v-model="addingUser.permission">
                                    <option value="VIEW" selected>View Only</option>
                                    <option value="EDIT">Edit</option>
                                </dropdown>
                            </field>
                        </div>
                        <div class="two buttons">
                            <button class="ui green icon button"><i class="check icon"></i> Save</button>
                            <button class="ui yellow icon button" @click.prevent="adding = false"><i class="x icon"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                </panel-form>
            </div>
        </settings-permissions>
    </div>

    <div class="ui {{$color}} segment">
        <h2>Role Permission</h2>
        <p>
            The below options control the permission level for roles. If a user has multiple roles, their effective permission
            will be of the highest permission level.
        </p>
        <settings-role-permissions inline-template>
            <div>
                <table class="ui celled table">
                    <thead>
                    <tr>
                        <th>Role ID</th>
                        <th>Role Name</th>
                        <th>Clearance Level</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="role in permissions" :key="role.id">
                        <td>@{{ role.role_id }}</td>
                        <td>@{{ role.name }}</td>
                        <td>
                            <form class="ui form" @submit.prevent="updatePermissionLevel(role.id)">
                                <div class="ui field">
                                    <input type="number" min="0" max="100" v-model="role.permission_level" @change="updatePermissionLevel(role.id)" :readonly="readonly"/>
                                </div>
                            </form>
                        </td>
                        <td>
                            <button class="ui red icon button" @click.prevent="deletePermission(role.id)" :disabled="readonly">
                                <i class="x icon"></i></button>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr v-if="!adding">
                        <th colspan="4">
                            <button class="ui green button" @click="adding=true" :disabled="readonly">Add</button>
                        </th>
                    </tr>
                    </tfoot>
                </table>
                <panel-form :form="permissionForm" v-show="adding" @submit.pevent="addPermission">
                    <div slot="inputs">
                        <div class="two fields">
                            <field name="roleId" :form="permissionForm">
                                <label>Role</label>
                                <dropdown v-model="permissionForm.roleId">
                                    <option v-for="role in roles" :key="role.id" :value="role.id">@{{ role.name }}</option>
                                </dropdown>
                            </field>
                            <field name="permissionLevel" :form="permissionForm">
                                <label>Permission</label>
                                <input type="number" min="0" max="100" v-model="permissionForm.permissionLevel"/>
                            </field>
                        </div>
                        <div class="two buttons">
                            <button class="ui green icon button" @click.prevent="addPermission">
                                <i class="check icon"></i> Save
                            </button>
                            <button class="ui yellow icon button" @click.prevent="adding = false"><i class="x icon"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                </panel-form>
            </div>
        </settings-role-permissions>
    </div>
@endsection