<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttachmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->string('id');
            $table->text('attachments')->nullable();
            $table->timestamps();
            $table->foreign('id')->references('id')->on('server_messages');
        });
        $to_insert = [];
        foreach (DB::table('server_messages')->select([
            'id',
            'attachments'
        ])->whereNotNull('attachments')->get() as $items) {
            $to_insert[] = [
                'id' => $items->id,
                'attachments' => $items->attachments,
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ];
        }
        DB::table('attachments')->insert($to_insert);
        Schema::table('server_messages', function (Blueprint $table) {
            $table->dropColumn('attachments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('attachments');
        Schema::table('server_messages', function (Blueprint $table) {
            $table->string('attachments')->after('message')->default(null)->nullable();
        });
        foreach (DB::table('attachments')->get() as $data) {
            DB::table('server_messages')->where('id', '=', $data->id)->update(['attachments' => $data->attachments]);
        }
    }
}
