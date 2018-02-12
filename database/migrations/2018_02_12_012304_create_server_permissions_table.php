<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateServerPermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('server_permissions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('user_id');
            $table->string('server_id');
            $table->string('permission');
            $table->foreign('server_id')->references('id')->on('server_settings')->onDelete('cascade');
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
        Schema::dropIfExists('server_permissions');
    }
}
