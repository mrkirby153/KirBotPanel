<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandAlias extends Model
{
    use HasRandomId;

    protected $table = "command_aliases";

    public $incrementing = false;
}
