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
Route::group(['middleware' => ['has_discord_token']], function () {

    Route::group(['prefix' => 'dashboard'], function(){
        // General
        Route::group(['middleware' => 'auth'], function(){
            Route::get('/{server}', 'Dashboard\GeneralController@showDashboard')->name('dashboard.general');
            Route::patch('/{server}/logging', 'Dashboard\GeneralController@updateLogging');
            Route::post('/{server}/realname', 'Dashboard\GeneralController@setRealnameSettings');
            Route::post('/{server}/whitelist', 'Dashboard\GeneralController@updateChannelWhitelist');
            Route::post('/{server}/managers', 'Dashboard\GeneralController@updateBotManagers');
        });

        // Commands
        Route::group(['middleware' => 'auth'], function(){
            Route::get('/{server}/commands', 'Dashboard\CommandController@showCommands')->name('dashboard.commands');
            Route::patch('/{server}/command/{command}', 'Dashboard\CommandController@updateCommand');
            Route::delete('/{server}/command/{command}', 'Dashboard\CommandController@deleteCommand');
            Route::patch('/{server}/discriminator', 'Dashboard\CommandController@updateDiscrim');
            Route::put('/{server}/commands', 'Dashboard\CommandController@createCommand');
        });

        // Music
        Route::group(['middleware' => 'auth'], function(){
            Route::get('/{server}/music', 'Dashboard\MusicController@index')->name('dashboard.music');
            Route::post('/{server}/music', 'Dashboard\MusicController@update');

        });

        // Channels
        Route::group([], function(){
            Route::get('/{server}/channels', 'Dashboard\ChannelController@index')->middleware('auth')->name('dashboard.channels');
            Route::post('/{server}/channels/{channel}/visibility', 'Dashboard\ChannelController@visibility')->middleware('auth');
        });

        Route::get('/{server}/log', 'Dashboard\GeneralController@showLog')->name('dashboard.log');
    });

    Route::get('/chat', 'BotChatController@index');
});

Route::get('/{server}/commands', 'Dashboard\GeneralController@showCommandList');
Route::get('/{server}/queue', 'Dashboard\MusicController@displayQueue');
Route::get('/{server}/quotes', 'Dashboard\GeneralController@showQuotes');

Route::get('login', 'AuthController@login')->name('login');
Route::get('logout', 'AuthController@logout')->name('logout');