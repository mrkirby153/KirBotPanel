<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateServerSettingsTable extends Migration
{

    private $relations = [
        'anti_raid_settings' => ['id'],
        'censor_settings' => ['id'],
        'channels' => ['server'],
        'command_aliases' => ['server_id'],
        'custom_commands' => ['server'],
        'guild_member_roles' => ['server_id'],
        'guild_members' => ['server_id'],
        'log_settings' => ['server_id'],
        'music_settings' => ['id'],
        'permission_overrides' => ['server_id'],
        'quotes' => ['server_id'],
        'role_permissions' => ['server_id'],
        'roles' => ['server_id'],
        'server_permissions' => ['server_id'],
        'spam_settings' => ['id'],
        'starboard_settings' => ['id']
    ];

    private $tables = [
        'anti_raid_settings' => [
            'ignore' => ['id', 'created_at', 'updated_at'],
            'prefix' => 'anti_raid',
            'guild_field' => 'id'
        ],
        'censor_settings' => [
            'ignore' => ['id', 'created_at', 'updated_at'],
            'prefix' => 'censor',
            'guild_field' => 'id'
        ],
        'music_settings' => [
            'ignore' => ['id', 'created_at', 'updated_at'],
            'prefix' => 'music',
            'guild_field' => 'id'
        ],
        'server_settings' => [
            'ignore' => ['id', 'name', 'icon_id', 'created_at', 'updated_at', 'deleted_at'],
            'prefix' => '',
            'guild_field' => 'id'
        ],
        'spam_settings' => [
            'ignore' => ['id', 'created_at', 'updated_at'],
            'prefix' => 'spam',
            'guild_field' => 'id'
        ],
        'starboard_settings' => [
            'ignore' => ['id', 'created_at', 'updated_at'],
            'prefix' => 'starboard',
            'guild_field' => 'id'
        ]
    ];

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('guild', function (Blueprint $table) {
            $table->string('id')->primary()->unique();
            $table->string('name');
            $table->string('icon_id')->nullable();
            $table->string('owner')->nullable()->default(null);
            $table->timestamps();
            $table->softDeletes();
        });
        // Transfer data from the server_settings table
        DB::insert("INSERT INTO `guild` (id, name, icon_id) SELECT id, name, icon_id FROM server_settings");
        DB::table('guild')->where('created_at', '=', null)->orWhere('updated_at', '=', null)->update([
            'created_at' => \Carbon\Carbon::now(),
            'updated_at' => \Carbon\Carbon::now()
        ]);

        // Drop all the foreign keys
        foreach ($this->relations as $table => $keys) {
            Schema::table($table, function (Blueprint $blueprint) use ($table, $keys) {
                $blueprint->dropForeign($keys);
                foreach ($keys as $key) {
                    $blueprint->foreign($key)->references('id')->on('guild')->onDelete('cascade');
                }
            });
        }

        Schema::table('rss_feeds', function (Blueprint $blueprint) {
            $blueprint->foreign('server_id')->references('id')->on('guild')->onDelete('cascade');
        });

        Schema::dropIfExists('user_groups');
        Schema::dropIfExists('groups');

        Schema::create('guild_settings', function (Blueprint $table) {
            $table->string('id')->primary()->unique();
            $table->string('guild')->index();
            $table->string('key')->index();
            $table->text('value')->nullable();
            $table->foreign('guild')->references('id')->on('guild')->onDelete('cascade');
            $table->timestamps();
        });

        // Migrate everything into the guild settings table
        foreach ($this->tables as $table => $settings) {
            $data = DB::table($table)->get(['*']);
            $to_insert = array();
            foreach ($data as $row) {
                foreach ($row as $key => $value) {
                    if (in_array($key, $settings['ignore'])) {
                        \Illuminate\Support\Facades\Log::info("Skipping $key");
                        continue;
                    }
                    // Wrap numbers that are too large for JS in strings
                    if(is_numeric($value) && ($value+0) > 9007199254740991) {
                        $value = "\"$value\"";
                    }
                    $id = \Keygen::alphanum(15)->generate();
                    $to_insert[] = [
                        'id' => $row->{$settings['guild_field']}.'_'.$key,
                        'guild' => $row->{$settings['guild_field']},
                        'key' => $settings['prefix'] . (($settings['prefix'] != '') ? '_' : '') . $key,
                        'value' => $value,
                        'created_at' => \Carbon\Carbon::now(),
                        'updated_at' => \Carbon\Carbon::now()
                    ];
                }
            }
            DB::table('guild_settings')->insert($to_insert);
        }
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('guild');
        foreach ($this->relations as $table => $keys) {
            Schema::table($table, function (Blueprint $blueprint) use ($table, $keys) {
                $blueprint->dropForeign($keys);
                foreach ($keys as $key) {
                    $blueprint->foreign($key)->references('id')->on('server_settings')->onDelete('cascade');
                }
            });
        }
        Schema::table('rss_feeds', function (Blueprint $blueprint) {
            $blueprint->dropForeign(['server_id']);
        });
        Schema::create('groups', function (Blueprint $table) {
            $table->string('id');
            $table->string('server_id');
            $table->string('group_name');
            $table->string('role_id');
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::create('user_groups', function (Blueprint $table) {
            $table->string('id');
            $table->string('user_id');
            $table->string('group_id');
            $table->softDeletes();
            $table->timestamps();
        });
        Schema::dropIfExists('guild_settings');
        Schema::enableForeignKeyConstraints();
    }
}
