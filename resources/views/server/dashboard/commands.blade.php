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
                <panel-form :form="forms.cmdDiscriminator" @submit="saveDiscrim">
                    <div slot="inputs">
                        <div class="one field">
                            <field name="discriminator" :form="forms.cmdDiscriminator">
                                <label>Discriminator</label>
                                <input name="discriminator" v-model="forms.cmdDiscriminator.discriminator" @change="saveDiscrim" :disabled="readonly"/>
                            </field>
                        </div>
                    </div>
                </panel-form>
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
                    <tr v-for="command in commands" :key="command.id">
                        <td>@{{ command.id }}</td>
                        <td>@{{ command.created_at }}</td>
                        <td>@{{ command.name }}</td>
                        <td style="-ms-word-wrap: break-word;word-wrap: break-word; max-width: 500px">@{{ command.data
                            }}
                        </td>
                        <td>@{{ command.clearance_level }}</td>
                        <td>
                            <div class="ui buttons">
                                <button class="ui button blue" @click="editCommand(command.id)" :disabled="readonly">Edit</button>
                                <button class="ui button red" @click="confirmDelete(command.id)" :disabled="readonly">Delete</button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colspan="6">
                            <button class="ui right floated button" @click="newCommand()" :disabled="readonly">Add Command
                            </button>
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
                    <panel-form :form="forms.editCommand">
                        <div slot="inputs">
                            <field :form="forms.editCommand" name="name" required="true">
                                <label>Command Name</label>
                                <input type="text" name="name" v-model="forms.editCommand.name"/>
                            </field>
                            <field :form="forms.editCommand" name="respect_whitelist">
                                <div class="ui checkbox">
                                    <input type="checkbox" v-model="forms.editCommand.respect_whitelist"
                                           name="respect_whitelist"/>
                                    <label><b>Respect Whitelist</b></label>
                                </div>
                            </field>
                            <field :form="forms.editCommand" name="description" required="true">
                                <label>Command Response</label>
                                <p>
                                    Arguments can be accessed with the following syntax:
                                    <code>%#</code>, where # is the argument number.
                                </p>
                                <p>For example, the first argument can be accessed with <code>%1</code></p>
                                <textarea v-model="forms.editCommand.description" name="description"></textarea>
                            </field>
                            <field name="clearance" :form="forms.editCommand" required="true">
                                <label>Clearance</label>
                                <input type="number" v-model="forms.editCommand.clearance"/>
                            </field>
                        </div>
                    </panel-form>
                </div>
                <div class="actions">
                    <div class="ui green ok button" :class="{'loading': forms.editCommand.busy}">Save</div>
                    <div class="ui cancel button">Cancel</div>
                </div>
            </div>
        </div>
    </settings-commands>
@endsection