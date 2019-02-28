<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddApiTokenField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('api_token')->nullable()->after('remember_token');
            $table->index('api_token');
        });

        // Generate API Tokens for users
        $results = DB::table('users')->whereNull('api_token')->get(['id']);
        foreach ($results as $row) {
            DB::table('users')->where('id', $row->id)->update([
                'api_token' => \Keygen::token(64)->generate()
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('api_token');
        });
    }
}
