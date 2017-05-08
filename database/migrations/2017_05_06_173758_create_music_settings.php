<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMusicSettings extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('music_settings', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->boolean('enabled')->default(true);
            $table->enum('mode', ['OFF','WHITELIST', 'BLACKLIST'])->default('OFF');
            $table->text('channels')->default('');
            $table->text('blacklist_songs')->default('')->nullable();
            $table->integer('max_queue_length')->default(-1);
            $table->integer('max_song_length')->default(-1);
            $table->integer('skip_cooldown')->default(0);
            $table->integer('skip_timer')->default(30);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('music_settings');
    }
}
