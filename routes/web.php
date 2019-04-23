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
    return view('home');
});

Route::get('/serverIcon', 'DashController@makeIcon')->name('serverIcon');

Route::get('/servers', 'DashController@displayOverview')->name('dashboard.all');
Route::group(['middleware' => ['has_discord_token', 'can:view,server']], function () {
    Route::group(['prefix' => 'dashboard'], function () {

        Route::get('/{server}/{any}', 'DashController@showDashboard')->where('any', '.*');
    });
});

Route::get('/archive/{key}', 'DashController@showArchived');

Route::group(['prefix' => 'admin'], function () {
    Route::get('/settings', 'AdminController@settings')->name('admin.settings');
    Route::get('/', 'AdminController@show')->name('admin.main');
});

Route::get('login', 'AuthController@doLogin')->name('login.do');
Route::get('/auth/login', 'AuthController@showLogin')->name('login');
Route::get('logout', 'AuthController@logout')->name('logout');
Route::get('/add', 'DashController@redirectToAddUrl')->name('add');