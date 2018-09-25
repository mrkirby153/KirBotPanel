<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateRealnameSetTypeString extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement("ALTER TABLE `server_settings` CHANGE `realname` `realname` VARCHAR(255) DEFAULT 'OFF'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement("ALTER TABLE `server_settings` CHANGE `realname` `realname` ENUM('OFF', 'FIRST_ONLY','FIRST_LAST') DEFAULT 'OFF'");
    }
}
