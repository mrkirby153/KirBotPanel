<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommandAliasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('command_aliases', function (Blueprint $table) {
            $table->string('id')->primary()->unique();
            $table->string('server_id');
            $table->string('command');
            $table->string('alias')->nullable()->default(null);
            $table->integer('clearance');
            $table->timestamps();

            $table->foreign('server_id')->references('id')->on('server_settings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('command_aliases');
    }
}
