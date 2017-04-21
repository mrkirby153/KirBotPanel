<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomCommandsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('custom_commands', function (Blueprint $table) {
            $table->string('id')->unique()->primary();
            $table->string('server');
            $table->string('name');
            $table->text('data');
            $table->enum('clearance', ['BOT_OWNER', 'SERVER_OWNER', 'SERVER_ADMINISTRATOR', 'BOT_MANAGER', 'USER', 'BOT']);
            $table->enum('type', ['TEXT', 'JAVASCRIPT']);
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
        Schema::drop('custom_commands');
    }
}
