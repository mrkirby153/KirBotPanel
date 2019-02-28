<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ApiController extends Controller
{

    public function __construct() {
        $this->middleware('auth:api');
    }

    public function getCurrentUser() {
        return \Auth::user();
    }
}
