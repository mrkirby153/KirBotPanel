<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateServerSettingsAddLoggingChannel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('server_settings', function (Blueprint $table) {
            $table->string('log_channel')->after('command_discriminator')->nullable();
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
            $table->dropColumn('log_channel');
        });
    }
}
