<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateInfractionsAddMetadata extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('infractions', function (Blueprint $table) {
            $table->text('metadata')->after('active')->nullable()->default(null);
            $table->renameColumn('revoked_at', 'expires_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('infractions', function (Blueprint $table) {
            $table->dropColumn('metadata');
            $table->renameColumn('expires_at', 'revoked_at');
        });
    }
}
