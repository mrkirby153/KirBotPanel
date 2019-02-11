<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DeleteOldSettingsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('anti_raid_settings');
        Schema::dropIfExists('censor_settings');
        Schema::dropIfExists('music_settings');
        Schema::dropIfExists('server_settings');
        Schema::dropIfExists('starboard_settings');
        Schema::dropIfExists('spam_settings');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('anti_raid_settings', function (Blueprint $table) {
            $table->string('id')->primary()->unique();
            $table->boolean('enabled')->default(false);
            $table->integer('count')->default(0);
            $table->integer('period')->default(0);
            $table->string('action')->nullable()->default(null);
            $table->string('alert_role')->nullable()->default(null);
            $table->string('alert_channel')->nullable()->default(null);
            $table->integer('quiet_period')->default(30);
            $table->timestamps();

            $table->foreign('id')->references('id')->on('guild')->onDelete('cascade');
        });
        Schema::create('censor_settings', function (Blueprint $table) {
            $table->string('id')->unique()->index();
            $table->text('settings');
            $table->timestamps();
            $table->foreign('id')->references('id')->on('guild')->onDelete('cascade');
        });
        Schema::create('music_settings', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->boolean('enabled')->default(true);
            $table->enum('mode', ['OFF','WHITELIST', 'BLACKLIST'])->default('OFF');
            $table->text('channels')->nullable();
            $table->text('blacklist_songs')->nullable();
            $table->integer('max_queue_length')->default(-1);
            $table->boolean('playlists')->default(true);
            $table->integer('max_song_length')->default(-1);
            $table->integer('skip_cooldown')->default(0);
            $table->integer('skip_timer')->default(30);
            $table->timestamps();
            $table->foreign('id')->references('id')->on('guild')->onDelete('cascade');
        });
        Schema::create('starboard_settings', function (Blueprint $table) {
            $table->string('id');
            $table->boolean('enabled')->default(false);
            $table->integer('star_count')->default(0);
            $table->integer('gild_count')->default(0);
            $table->boolean('self_star')->default(false);
            $table->string('channel_id')->default(null)->nullable();

            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('no action');
            $table->foreign('id')->references('id')->on('guild')->onDelete('cascade');
            $table->primary('id');
            $table->timestamps();
        });
        Schema::create('server_settings', function (Blueprint $table) {
            $table->string('id')->unique()->primary();
            $table->string('name')->default('Unknown');
            $table->string('icon_id')->nullable()->default(null);
            $table->char('command_discriminator', 1)->default('!');
            $table->boolean('command_silent_fail')->default(false);
            $table->string('log_timezone');
            $table->text("cmd_whitelist");
            $table->text('bot_nick')->nullable();
            $table->integer('user_persistence')->default(0);
            $table->text('persist_roles')->default("[]");
            $table->string('muted_role')->nullable()->default(null);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('spam_settings', function (Blueprint $table) {
            $table->string('id')->unique()->index();
            $table->text('settings');
            $table->timestamps();

            $table->foreign('id')->references('id')->on('guild')->onDelete('cascade');
        });
    }
}
