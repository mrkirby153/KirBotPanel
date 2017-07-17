@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab)
    ?>
    <settings-commands inline-template>
        <div>
            <div class="ui {{$color}} segment">
                <h2>Command Discriminator</h2>
                <p>The prefix which all commands on the server use</p>
                <form class="ui form" :class="{'success': forms.cmdDiscriminator.successful, 'error':forms.cmdDiscriminator.errors.hasErrors(), 'loading': forms.cmdDiscriminator.busy}" @submit.prevent="saveDiscrim">
                    <form-messages success-header="Success!" success-body="Saved!" :error-array="forms.cmdDiscriminator.errors.flatten()"></form-messages>
                    <div class="one field">
                        <div class="ui field">
                            <label>Discriminator</label>
                            <input type="text" v-model="forms.cmdDiscriminator.discriminator"/>
                        </div>
                    </div>
                    <button class="ui button fluid green" @click.prevent="saveDiscrim">Save</button>
                </form>
            </div>
            <div class="ui {{$color}} segment">
                <h2>Custom Commands</h2>
                <p>Below are all the custom commands registered on the server</p>
                <table class="ui celled table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Created</th>
                        <th>Command Name</th>
                        <th>Command Response</th>
                        <th>Clearance</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="command in commands">
                        <td>@{{ command.id }}</td>
                        <td>@{{ command.created_at }}</td>
                        <td>@{{ command.name }}</td>
                        <td style="-ms-word-wrap: break-word;word-wrap: break-word; max-width: 500px">@{{ command.data }}</td>
                        <td>@{{ localizeClearance(command.clearance) }}</td>
                        <td>
                            <div class="ui buttons">
                                <button class="ui button blue" @click="editCommand(command.id, false)">Edit</button>
                                <button class="ui button red" @click="confirmDelete(command.id)">Delete</button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colspan="6">
                            <button class="ui right floated button" @click="editCommand(null, true)">Add Command</button>
                        </th>
                    </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Delete Confirm Modal -->

            <div class="ui modal" id="delete-command-modal">
                <div class="header">
                    Confirm Delete
                </div>
                <div class="content">
                    Are you sure you want to delete this command?
                </div>
                <div class="actions">
                    <button class="ui red ok button">Delete</button>
                    <button class="ui cancel button">Cancel</button>
                </div>
            </div>

            <!-- Edit Command Modal -->
            <div class="ui modal" id="edit-command-modal">
                <div class="header">
                    <span v-if="addingCommand">New Command</span>
                    <span v-else>Edit Command: @{{ forms.editCommand.name }}</span>
                </div>
                <div class="content">
                    <form class="ui form" :class="{'error':forms.editCommand.errors.hasErrors(), 'loading': forms.editCommand.busy, 'success':forms.editCommand.successful}">
                        <form-messages success-body="Saved!" :error-array="forms.editCommand.errors.flatten()"></form-messages>
                        <div class="required field">
                            <label>Command Name</label>
                            <input type="text" v-model="forms.editCommand.name"/>
                        </div>
                        <div class="required field">
                            <div class="ui checkbox">
                                <input type="checkbox" v-model="forms.editCommand.respect_whitelist"/>
                                <label><b>Respect Whitelist</b></label>
                            </div>
                            <p>If this command respects the global whitelist setting for commands</p>
                        </div>
                        <div class="required field">
                            <label>Command Response</label>
                            <p>
                                Arguments can be accessed with the following syntax:
                                <code>%#</code>, where # is the argument number.
                            </p>
                            <p>For example, the first argument can be accessed with <code>%1</code></p>
                            <textarea v-model="forms.editCommand.description"></textarea>
                        </div>
                        <h3>Clearance Hierarchy</h3>
                        <p>
                            <b>Server Owner: </b>The user who owns the server on discord <br/>
                            <b>Server Administrator: </b>Anyone with the
                            <code>Server Administrator</code> permission<br/>
                            <b>Bot Manager: </b>Anyone with the Bot Manager role (Not yet implemented)<br/>
                            <b>Users: </b>Any user who doesn't meet the previous criteria<br/>
                            <b>Other Bots: </b>Other discord robots on the server<br/>
                        </p>
                        <div class="required field">
                            <label>Clearance</label>
                            <select v-model="forms.editCommand.clearance" class="ui fluid dropdown">
                                <option value="SERVER_OWNER">Server Owner</option>
                                <option value="SERVER_ADMINISTRATOR">Server Administrator</option>
                                <option value="BOT_MANAGER">Bot Manager</option>
                                <option value="USER">Users</option>
                                <option value="BOT">Other Bots</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="actions">
                    <div class="ui green ok button" :class="{'loading': forms.editCommand.busy}">Save</div>
                    <div class="ui cancel button">Cancel</div>
                </div>
            </div>
        </div>
    </settings-commands>
@endsection