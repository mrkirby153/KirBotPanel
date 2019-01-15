<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropForeignKeys extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();
        Schema::table('server_messages', function (Blueprint $table) {
            $table->dropForeign(['server_id']);
            $table->dropForeign(['channel']);
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::disableForeignKeyConstraints();
        Schema::table('server_messages', function (Blueprint $table) {
            $table->foreign('server_id')->references('id')->on('server_settings')->onDelete('cascade');
            $table->foreign('channel')->references('id')->on('channels')->onDelete('cascade');
        });
        Schema::enableForeignKeyConstraints();
    }
}
