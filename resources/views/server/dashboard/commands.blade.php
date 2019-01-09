@extends('layouts.dashboard')

@section('panel')
    <settings-commands inline-template>
        <div>
            <div class="row">
                <div class="col-12">
                    <panel-form :form="forms.cmdDiscriminator">
                        <field name="discriminator" :form="forms.cmdDiscriminator"
                                help="The prefix which all commands on the server use" show-success="true">
                            <span slot="valid-feedback">Prefix saved!</span>
                            <label><b>Command Prefix</b></label>
                            <input type="text" class="form-control" v-model="forms.cmdDiscriminator.discriminator"
                                    @change="saveDiscrim" :readonly="readonly"/>
                        </field>
                        <div class="form-group">
                            <input-switch label="Silent Fail" v-model="forms.silentFail.silent" @change="saveSilent"></input-switch>
                            <p class="form-text text-muted">
                                If KirBot should silently ignore commands if the executor doesn't have permissiom
                            </p>
                        </div>
                    </panel-form>
                    <h5>Example Command</h5>
                    <code>@{{ forms.cmdDiscriminator.discriminator }}play
                        https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>
                </div>
            </div>
            <hr/>
            <div class="row">
                <div class="col-12">
                    <h2>Custom Commands</h2>
                    <p>
                        The table below is all the commands registered on the server
                    </p>

                    <div class="table-responsive">
                        <table class="table mt-1 table-bordered table-hover">
                            <thead class="thead-light">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Response</th>
                                <th scope="col">Clearance</th>
                                <th scope="col">Actions</th>
                            </tr>
                            </thead>
                            <tbody is="transition-group" name="fade">
                            <tr v-for="command in commands" :key="command.id">
                                <td>@{{ command.name }}</td>
                                <td>@{{ command.created_at }}</td>
                                <td class="custom-command-data">@{{ command.data }}</td>
                                <td>@{{ command.clearance_level }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-info" @click="editCommand(command.id)" :disabled="readonly">
                                            <i
                                                    class="fas fa-pen"></i> Edit
                                        </button>
                                        <button class="btn btn-danger" @click="deleteCommand(command.id)" :disabled="readonly">
                                            <i
                                                    class="fas fa-times"></i>
                                            <span v-if="isConfirming(command.id)">Confirm?</span><span
                                                    v-else>Delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colspan="5">
                                    <button class="btn btn-success" @click="addCommand" :disabled="readonly">
                                        <i class="fas fa-plus"></i> New
                                        Command
                                    </button>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal fade" tabindex="-1" role="dialog" id="commandModal">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" v-if="addingCommand">Add Command</h5>
                            <h5 class="modal-title" v-else>Edit Command</h5>
                        </div>
                        <div class="modal-body">
                            <panel-form :form="forms.editCommand">
                                <field name="name" :form="forms.editCommand">
                                    <label>Command Name</label>
                                    <small class="form-text text-muted">The command's name</small>
                                    <input type="text" class="form-control" v-model="forms.editCommand.name"/>
                                </field>
                                <input-switch v-model="forms.editCommand.respect_whitelist"
                                        label="Respect Whitelist"></input-switch>
                                <field name="description" :form="forms.editCommand">
                                    <label>Command Response</label>
                                    <small class="form-text text-muted">What will be sent when the command is executed
                                    </small>
                                    <textarea class="form-control" v-model="forms.editCommand.description"></textarea>
                                </field>
                                <field name="clearance" :form="forms.editCommand">
                                    <label>Clearance</label>
                                    <input type="number" v-model="forms.editCommand.clearance" min="0" max="100"
                                            class="form-control"/>
                                </field>
                            </panel-form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" @click="saveCommand">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </settings-commands>
    <hr/>
    <settings-command-aliases inline-template>
        <div class="row">
            <div class="col-12">
                <h2>Command Aliases</h2>
                <p>A list of all configured command aliases.</p>
                <div class="table-responsive">

                    <table class="table table-hover mt-2">
                        <thead class="thead-light">
                        <tr>
                            <th scope="col">Command</th>
                            <th scope="col">Alias</th>
                            <th scope="col">Clearance Override</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody is="transition-group" name="fade">
                        <tr v-for="alias in aliases" :key="alias.id">
                            <td>@{{ alias.command }}</td>
                            <td v-if="alias.alias">@{{ alias.alias }}</td>
                            <td v-else><i>Clearance Override Only</i></td>
                            <td v-if="alias.clearance !== -1">@{{ alias.clearance }}</td>
                            <td v-else><i>Inherit</i></td>
                            <td>
                                <div class="btn-group">
                                    <button class="btn btn-danger" @click="deleteAlias(alias.id)" :disabled="readonly">
                                        <i
                                                class="fas fa-times"></i>
                                        <span v-if="isConfirming(alias.id)">Confirm?</span><span v-else>Delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <th v-if="adding" colspan="4">
                                <panel-form :form="forms.createAlias">
                                    <div class="form-row">
                                        <div class="col-md-3">
                                            <field name="command" :form="forms.createAlias">
                                                <label>Command</label>
                                                <input type="text" class="form-control"
                                                        v-model="forms.createAlias.command"/>
                                            </field>
                                        </div>
                                        <div class="col-md-3">
                                            <field name="alias" :form="forms.createAlias">
                                                <label>Alias</label>
                                                <input type="text" class="form-control"
                                                        v-model="forms.createAlias.alias"/>
                                            </field>
                                        </div>
                                        <div class="col-md-3">
                                            <field name="clearance" :form="forms.createAlias">
                                                <label>Clearance</label>
                                                <input type="number" min="-1" max="100" class="form-control"
                                                        v-model="forms.createAlias.clearance"/>
                                            </field>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="btn-group">
                                            <button class="btn btn-warning" @click="adding = false">Cancel</button>
                                            <button class="btn btn-success" @click="addAlias">Save</button>
                                        </div>
                                    </div>
                                </panel-form>
                            </th>
                            <th v-else colspan="4">
                                <button class="btn btn-success" @click="adding = true" :disabled="readonly">
                                    <i class="fas fa-plus"></i> New
                                    Alias
                                </button>
                            </th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </settings-command-aliases>

@endsection