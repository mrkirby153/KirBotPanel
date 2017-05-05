<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateChannelsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('channels', function (Blueprint $table) {
            $table->string('id')->primary()->unique();
            $table->string('server');
            $table->string('channel_name');
            $table->enum('type', ['VOICE', 'TEXT']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('channels');
    }
}
