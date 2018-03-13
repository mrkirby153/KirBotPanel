<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateMessageAddExtraData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('server_messages', function (Blueprint $table) {
            $table->boolean('deleted')->default(false)->after('message');
            $table->integer('edit_count')->default(0)->after('message');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('server_messages', function (Blueprint $table) {
            $table->dropColumn('deleted');
            $table->dropColumn('edit_count');
        });
    }
}
