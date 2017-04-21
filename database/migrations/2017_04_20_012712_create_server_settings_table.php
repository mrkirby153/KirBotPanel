<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServerSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('server_settings', function (Blueprint $table) {
            $table->string('id')->unique();
            $table->enum('realname', ['OFF', 'FIRST_ONLY', 'FIRST_LAST'])->default('OFF');
            $table->boolean('require_realname')->default(false);
            $table->char('command_discriminator', 1)->default('!');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('server_settings');
    }
}
