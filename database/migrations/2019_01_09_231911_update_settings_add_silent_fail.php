<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateSettingsAddSilentFail extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('server_settings', function (Blueprint $table) {
            $table->boolean('command_silent_fail')->default(false)->after('command_discriminator');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('server_settings', function (Blueprint $table) {
            $table->dropColumn('command_silent_fail');
        });
    }
}
