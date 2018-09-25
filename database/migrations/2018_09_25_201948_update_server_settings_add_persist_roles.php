<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateServerSettingsAddPersistRoles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('server_settings', function (Blueprint $table) {
            $table->integer('user_persistence')->default(0)->change();
            $table->text('persist_roles')->default("[]")->after('user_persistence');
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
            $table->boolean('user_persistence')->default(false)->change();
            $table->dropColumn('persist_roles');
        });
    }
}
