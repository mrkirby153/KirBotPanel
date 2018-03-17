<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RemoveLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('log');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('log', function(Blueprint $table){
            $table->increments('id');
            $table->string('server_id');
            $table->string('action');
            $table->string('acting_user');
            $table->text('extra_data');
            $table->timestamps();
        });
    }
}
