<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAntiRaidSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('anti_raid_settings', function (Blueprint $table) {
            $table->string('id')->primary()->unique();
            $table->boolean('enabled')->default(false);
            $table->integer('count')->default(0);
            $table->integer('period')->default(0);
            $table->string('action')->nullable()->default(null);
            $table->string('alert_role')->nullable()->default(null);
            $table->string('alert_channel')->nullable()->default(null);
            $table->integer('quiet_period')->default(30);
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
        Schema::dropIfExists('anti_raid_settings');
    }
}
