<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropUserInfoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists("user_info");
        Schema::table('server_settings', function (Blueprint $table) {
            $table->dropColumn('realname');
            $table->dropColumn('require_realname');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create("user_info", function(Blueprint $table) {
            $table->string('id')->unique()->notNull();
            $table->string('first_name')->notNull();
            $table->string('last_name')->notNull();
            $table->boolean('changed')->default(false);
            $table->timestamps();
        });
        Schema::table('server_settings', function (Blueprint $table) {
            $table->string('realname')->default('OFF')->after('icon_id');
            $table->boolean('require_realname')->after('realname')->default(false);
        });
    }
}
