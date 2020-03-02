<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class NewSpamCensorFormat extends Migration
{

    public function up()
    {
        $columns = DB::table('guild_settings')->select(['id', 'value'])->where('key', '=', 'censor_settings')->get();
        DB::beginTransaction();
        try {
            foreach ($columns as $column) {
                $data = json_decode($column->value);
                $rules = array();
                foreach ($data as $k => $v) {
                    if (preg_match('/[0-9]+/', $k)) {
                        $v->_level = $k;
                        $rules[] = $v;
                    }
                }
                DB::table('guild_settings')->where('id', '=', $column->id)->update([
                    'value' => [
                        'rules' => $rules
                    ]
                ]);
            }

            $columns = DB::table('guild_settings')->select(['id', 'value'])->where('key', '=', 'spam_settings')->get();
            foreach ($columns as $column) {
                $data = json_decode($column->value);
                $rules = array();
                $to_unset = array();
                foreach ($data as $k => $v) {
                    if (preg_match('/[0-9]+/', $k)) {
                        $v->_level = $k;
                        $rules[] = $v;
                        $to_unset[] = $k;
                    }
                }
                foreach ($to_unset as $u) {
                    unset($data->$u);
                }
                $data->rules = $rules;
                DB::table('guild_settings')->where('id', '=', $column->id)->update([
                    'value' => json_encode($data)]);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function down()
    {
        // This only goes forward
    }
}
