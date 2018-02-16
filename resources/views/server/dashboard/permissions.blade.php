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
                            <dropdown @change="updatePermission($event, permission.id)" :value="permission.permission"
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
@endsection