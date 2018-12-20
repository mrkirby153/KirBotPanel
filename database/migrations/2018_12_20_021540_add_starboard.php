<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStarboard extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('starboard', function (Blueprint $table) {
            $table->string('id')->unique(); // The message ID will be used
            $table->integer('star_count')->default(0);
            $table->boolean('hidden')->default(false);
            $table->string('starboard_mid')->default(null)->nullable();
            $table->timestamps();
        });
        Schema::create('starboard_settings', function (Blueprint $table) {
            $table->string('id');
            $table->boolean('enabled')->default(false);
            $table->integer('star_count')->default(0);
            $table->integer('gild_count')->default(0);
            $table->boolean('self_star')->default(false);
            $table->string('channel_id')->default(null)->nullable();

            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('no action');
            $table->foreign('id')->references('id')->on('server_settings')->onDelete('cascade');
            $table->primary('id');
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
        Schema::dropIfExists('starboard');
        Schema::dropIfExists('starboard_settings');
    }
}
