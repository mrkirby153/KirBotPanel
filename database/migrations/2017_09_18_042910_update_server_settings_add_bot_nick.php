<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateServerSettingsAddBotNick extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('server_settings', function (Blueprint $table) {
            $table->text('bot_nick')->after('bot_manager')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('server_settings', function (Blueprint $table) {
            $table->dropColumn('bot_nick');
        });
    }
}
