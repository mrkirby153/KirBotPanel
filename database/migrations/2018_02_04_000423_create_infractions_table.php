<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInfractionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('infractions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_id');
            $table->string('guild');
            $table->string('issuer')->nullable();
            $table->string('type');
            $table->string('reason');
            $table->boolean('active')->default(true);
            $table->timestamp('created_at', 0)->nullable();
            $table->timestamp('revoked_at', 0)->nullable()->default(null);
        });
        // Start with 1000 as an infraction ID
        DB::unprepared('ALTER TABLE `infractions` AUTO_INCREMENT = 1000');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('infractions');
    }
}
