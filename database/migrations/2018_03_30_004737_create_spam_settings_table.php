<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSpamSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('spam_settings', function (Blueprint $table) {
            $table->string('id')->unique()->index();
            $table->text('settings');
            $table->timestamps();

            $table->foreign('id')->references('id')->on('server_settings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('spam_settings');
    }
}
