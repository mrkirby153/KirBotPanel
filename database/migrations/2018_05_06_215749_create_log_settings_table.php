<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('log_settings', function (Blueprint $table) {
            $table->string('id')->unique();
            $table->string('server_id');
            $table->string('channel_id');
            $table->integer('events');
            $table->timestamps();

            $table->foreign('server_id')->references('id')->on('server_settings')->onDelete('cascade');
            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('cascade');
        });

        Schema::table('server_settings', function (Blueprint $tale) {
            $tale->dropColumn('log_channel');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('log_settings');
        Schema::table('server_settings', function (Blueprint $table) {
            $table->string('log_channel')->nullable()->after('command_discriminator');
        });
    }
}
