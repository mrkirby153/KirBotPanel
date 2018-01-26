<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeys extends Migration {

    private $relations = [
        'channels' => ['server:server_settings.id'],
        'custom_commands' => ['server:server_settings.id'],
        'groups' => ['server_id:server_settings.id'],
        'guild_member_roles' => ['server_id:server_settings.id', 'role_id:roles.id'],
        'guild_members' => ['server_id:server_settings.id'],
        'music_settings' => ['id:server_settings.id'],
        'permission_overrides' => ['server_id:server_settings.id'],
        'quotes' => ['server_id:server_settings.id'],
        'roles' => ['server_id:server_settings.id'],
        'rss_feed_items' => ['rss_feed_id:rss_feeds.id'],
        'server_messages' => ['server_id:server_settings.id'],
        'log' => ['server_id:server_settings.id'],
        'user_groups' => ['group_id:groups.id']
    ];


    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        // Make the groups id column unique (if it isn't already) so we can add a foreign key to it
        Schema::table('groups', function (Blueprint $table){
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexes = $sm->listTableIndexes('groups');
            if(!array_key_exists('groups_id_unique', $indexes)) {
                $table->unique('id');
            }
        });
        foreach ($this->relations as $table => $relations) {
            foreach ($relations as $relation) {
                $exploded = explode(':', $relation);
                $key_name = $exploded[0];
                $foreign_reference = $exploded[1];

                $foreign_table = explode('.', $foreign_reference)[0];
                $foreign_key = explode('.', $foreign_reference)[1];

                Schema::table($table, function (Blueprint $table) use ($key_name, $foreign_table, $foreign_key) {
                    $table->foreign($key_name)->references($foreign_key)->on($foreign_table)->onDelete("cascade");
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('groups', function (Blueprint $table){
            $table->dropUnique(['id']);
        });

        foreach ($this->relations as $table => $relations) {
            foreach ($relations as $relation) {
                $key = explode(':', $relation)[0];
                Schema::table($table, function (Blueprint $table) use ($key) {
                    $table->dropForeign([$key]);
                });
            }
        }
    }
}
