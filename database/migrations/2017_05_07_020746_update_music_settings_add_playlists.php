<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateMusicSettingsAddPlaylists extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('music_settings', function (Blueprint $table) {
            $table->boolean('playlists')->after('max_queue_length')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('music_settings', function (Blueprint $table) {
            $table->dropColumn('playlists');
        });
    }
}
