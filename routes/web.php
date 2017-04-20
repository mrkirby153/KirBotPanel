<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/name', 'UserController@displaySettings');
Route::post('/name', 'UserController@updateName');

Route::get('/servers', 'ServerController@displayOverview')->middleware('auth')->name('dashboard.all');
Route::get('/dashboard/{server}', 'ServerController@showDashboard')->middleware('auth')->name('dashboard.general');

Route::post('/dashboard/{server}/realname', 'ServerController@setRealnameSettings');

Route::get('login', 'AuthController@login');
Route::get('logout', 'AuthController@logout');