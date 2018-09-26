<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateGuildMembersAddMuted extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('guild_members', function (Blueprint $table) {
            $table->boolean('deafened')->default(false)->after('user_nick');
            $table->boolean('muted')->default(false)->after('deafened');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('guild_members', function (Blueprint $table) {
            $table->dropColumn('deafened');
            $table->dropColumn('muted');
        });
    }
}
