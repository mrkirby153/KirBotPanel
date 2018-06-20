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
                                <input name="discriminator" v-model="forms.cmdDiscriminator.discriminator"
                                       @change="saveDiscrim" :disabled="readonly"/>
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
                                <button class="ui button blue" @click="editCommand(command.id)" :disabled="readonly">
                                    Edit
                                </button>
                                <button class="ui button red" @click="confirmDelete(command.id)" :disabled="readonly">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colspan="6">
                            <button class="ui right floated button" @click="newCommand()" :disabled="readonly">Add
                                Command
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

    <div class="ui {{$color}} segment">
        <h2>Command Aliases</h2>
        <p>A list of all configured command aliases</p>
        <settings-command-aliases inline-template>
            <div>
                <table class="ui celled table">
                    <thead>
                    <tr>
                        <th>Command</th>
                        <th>Alias</th>
                        <th>Clearance Override</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="alias in aliases" :key="alias.id">
                        <td>@{{ command_discriminator + alias.command }}</td>
                        <td v-if="alias.alias">@{{command_discriminator + alias.alias }}</td>
                        <td v-else><em>No Alias Specified -- Overriding clearance</em></td>
                        <td v-if="alias.clearance !== -1">@{{ alias.clearance }}</td>
                        <td v-else>Inherit</td>
                        <td>
                            <button class="ui red icon button" @click.prevent="removeAlias(alias.id)"><i class="x icon"></i></button>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colspan="4">
                            <button class="ui right floated button" :disabled="readonly" @click="adding = true">Add Alias</button>
                        </th>
                    </tr>
                    </tfoot>
                </table>
                <panel-form :form="forms.createAlias" v-show="adding" @submit="addAlias">
                    <div slot="inputs">
                        <div class="three fields">
                            <field name="command" :form="forms.createAlias">
                                <label>Command Name</label>
                                <input type="text" v-model="forms.createAlias.command"/>
                            </field>
                            <field name="alias" :form="forms.createAlias">
                                <label>Alias <small><em>Leave blank to override clearance only</em></small></label>
                                <input type="text" v-model="forms.createAlias.alias"/>
                            </field>
                            <field name="clearance" :form="forms.createAlias">
                                <label>Clearance Override <small><em>Set to -1 to inherit override</em></small></label>
                                <input type="number" v-model="forms.createAlias.clearance" min="-1" max="100"/>
                            </field>
                        </div>
                        <div class="two buttons">
                            <button class="ui green icon button"><i class="check icon"></i> Save</button>
                            <button class="ui yellow icon button" @click.prevent="cancelAdd"><i class="x icon"></i> Cancel</button>
                        </div>
                    </div>
                </panel-form>
            </div>

        </settings-command-aliases>
    </div>
@endsection