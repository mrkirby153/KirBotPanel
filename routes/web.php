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

Route::get('/name', 'UserController@displaySettings');
Route::post('/name', 'UserController@updateName')->middleware('auth');


Route::get('/servers', 'Dashboard\GeneralController@displayOverview')->name('dashboard.all');
Route::group(['middleware' => 'has_discord_token'], function () {
    // General
    Route::get('/dashboard/{server}', 'Dashboard\GeneralController@showDashboard')->middleware('auth')->name('dashboard.general');
    Route::patch('/dashboard/{server}/logging', 'Dashboard\GeneralController@updateLogging')->middleware(['auth']);
    Route::post('/dashboard/{server}/realname', 'Dashboard\GeneralController@setRealnameSettings');
    Route::post('/dashboard/{server}/whitelist', 'Dashboard\GeneralController@updateChannelWhitelist');

    // Commands
    Route::get('/dashboard/{server}/commands', 'Dashboard\CommandController@showCommands')->middleware('auth')->name('dashboard.commands');
    Route::patch('/dashboard/{server}/commands', 'Dashboard\CommandController@updateCommand')->middleware('auth');
    Route::delete('/dashboard/{server}/command/{command}', 'Dashboard\CommandController@deleteCommand')->middleware('auth');
    Route::patch('/dashboard/{server}/discriminator', 'Dashboard\CommandController@updateDiscrim')->middleware('auth');
    Route::put('/dashboard/{server}/commands', 'Dashboard\CommandController@createCommand')->middleware('auth');

    // Music
    Route::get('/dashboard/{server}/music', 'Dashboard\MusicController@index')->middleware('auth')->name('dashboard.music');
    Route::post('/dashboard/{server}/music', 'Dashboard\MusicController@update')->middleware('auth');

    // Channels
    Route::get('/dashboard/{server}/channels', 'Dashboard\ChannelController@index')->middleware('auth')->name('dashboard.channels');
    Route::post('/dashboard/{server}/channels/{channel}/visibility', 'Dashboard\ChannelController@visibility')->middleware('auth');
    Route::post('/dashboard/{server}/channels/{channel}/access', 'Dashboard\ChannelController@regainAccess')->middleware('auth');

    Route::get('/dashboard/{server}/log', 'Dashboard\GeneralController@showLog')->name('dashboard.log');
});

Route::get('/{server}/commands', 'Dashboard\GeneralController@showCommandList');
Route::get('/{server}/queue', 'Dashboard\MusicController@displayQueue');

Route::get('login', 'AuthController@login')->name('login');
Route::get('logout', 'AuthController@logout')->name('logout');