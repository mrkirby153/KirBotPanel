<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateLogSettingsAddExcludes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('log_settings', function (Blueprint $table) {
            $table->integer('excluded')->after('events');
            $table->renameColumn('events', 'included');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('log_settings', function (Blueprint $table) {
            $table->dropColumn('excluded');
            $table->renameColumn('included', 'events');
        });
    }
}
