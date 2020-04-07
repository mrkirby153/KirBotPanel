<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveQuoteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('quotes');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('server_id');
            $table->string("message_id");
            $table->string('user');
            $table->text('content');
            $table->timestamps();

            $table->foreign('server_id')->references('id')->on('guild')->onDelete('cascade');
        });
    }
}
