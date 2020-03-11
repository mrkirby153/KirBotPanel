<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReactionRoleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reaction_roles', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('guild_id');
            $table->string('channel_id');
            $table->string('role_id');
            $table->string('message_id');
            $table->boolean('custom_emote')->default(false);
            $table->string('emote');
            $table->timestamps();

            $table->foreign('guild_id')->references('id')->on('guild')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reaction_roles');
    }
}
