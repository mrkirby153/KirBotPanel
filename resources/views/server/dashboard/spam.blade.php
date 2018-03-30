@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab)
    ?>
    <settings-spam inline-template>
        <div>
            <h2>Spam Settings</h2>
            <p>
                <b>Available Rules</b><br/>
                For each clearance level, the following rules are available: <code>max_links, max_messages,
                    max_mentions, max_attachments, max_newlines</code>
                <br>
                <code>interval</code> - The period of time (in seconds) which the count can be performed before
                triggering <br/>
                <code>count</code> - The amount of actions
            </p>
            <transition name="fade">
                <div class="ui success message" v-if="success"><b>Success</b>
                    <p>Settings have been saved!</p></div>
                <div class="ui error message" v-if="fail"><b>Error</b>
                    <p> An error occurred when saving. Please try again.</p></div>
            </transition>
            <div class="two buttons" v-if="changed">
                <button class="ui yellow button" :disabled="readonly || loading" style="margin-bottom: 10px"
                        @click="discard">Discard
                </button>
                <button class="ui green button" :disabled="loading || readonly" style="margin-bottom: 10px"
                        @click="save">Save
                </button>
            </div>
            <div id="jsoneditor" style="height: 500px"></div>
        </div>
    </settings-spam>
    <div class="ui basic modal" id="confirm-revert">
        <div class="ui icon header">
            <i class="warning icon"></i>
            Discard Changes?
        </div>
        <div class="content">
            <p>Are you sure you want to discard your changes? This cannot be undone</p>
        </div>
        <div class="actions">
            <div class="ui green ok inverted right labeled icon button">
                <i class="checkmark icon"></i> Yes
            </div>
            <div class="ui red basic cancel inverted right labeled icon button">
                <i class="remove icon"></i> No
            </div>
        </div>
    </div>
@endsection
