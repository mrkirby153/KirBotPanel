<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->string('id')->unique();
            $table->string('server_id')->index();
            $table->string('role_id')->index();
            $table->integer('permission_level')->default(0);

            $table->foreign('server_id')->references('id')->on('server_settings')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->timestamps();
        });
        Schema::table('server_settings', function (Blueprint $table) {
            $table->dropColumn('bot_manager');
        });
        Schema::table('custom_commands', function (Blueprint $table) {
            $table->dropColumn('clearance');
            $table->integer('clearance_level')->default(0)->after('data');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('role_permissions');
        Schema::table('server_settings', function (Blueprint $table) {
            $table->string('bot_manager')->after('cmd_whitelist');
        });
        Schema::table('custom_commands', function (Blueprint $table) {
            $table->dropColumn('clearance_level');
            $table->enum('clearance', ['BOT_OWNER', 'SERVER_OWNER', 'SERVER_ADMINISTRATOR', 'BOT_MANAGER', 'USER', 'BOT'])->default('USER')->after('data');
        });
    }
}
