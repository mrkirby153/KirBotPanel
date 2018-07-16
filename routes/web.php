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
Route::get('/serverIcon', 'Dashboard\GeneralController@makeIcon')->name('serverIcon');

Route::get('/servers', 'Dashboard\GeneralController@displayOverview')->name('dashboard.all');
Route::group(['middleware' => ['has_discord_token', 'can:view,server']], function () {
    Route::group(['prefix' => 'dashboard'], function () {
        // General
        Route::group(['middleware' => 'auth'], function () {
            Route::get('/{server}', 'Dashboard\GeneralController@showDashboard')->name('dashboard.general');
            Route::patch('/{server}/logging', 'Dashboard\GeneralController@updateLogging');
            Route::post('/{server}/realname', 'Dashboard\GeneralController@setRealnameSettings');
            Route::post('/{server}/whitelist', 'Dashboard\GeneralController@updateChannelWhitelist');
            Route::post('/{server}/botName', 'Dashboard\GeneralController@setUsername');
            Route::patch('/{server}/persistence', 'Dashboard\GeneralController@setPersistence');

            Route::get('/{server}/api/infractions', 'Dashboard\GeneralController@retrieveInfractions');
        });

        // Commands
        Route::group(['middleware' => 'auth'], function () {
            Route::get('/{server}/commands', 'Dashboard\CommandController@showCommands')->name('dashboard.commands');
            Route::patch('/{server}/command/{command}', 'Dashboard\CommandController@updateCommand');
            Route::delete('/{server}/command/{command}', 'Dashboard\CommandController@deleteCommand');
            Route::patch('/{server}/discriminator', 'Dashboard\CommandController@updateDiscrim');
            Route::put('/{server}/commands', 'Dashboard\CommandController@createCommand');

            Route::put('/{server}/commands/alias', 'Dashboard\CommandController@createAlias');
            Route::delete('/{server}/commands/alias/{alias}', 'Dashboard\CommandController@deleteAlias');
        });

        // Music
        Route::group(['middleware' => 'auth'], function () {
            Route::get('/{server}/music', 'Dashboard\MusicController@index')->name('dashboard.music');
            Route::post('/{server}/music', 'Dashboard\MusicController@update');
        });

        Route::group(['middleware' => 'auth'], function () {
            Route::get('/{server}/permissions', 'Dashboard\PermissionController@showPane')->name('dashboard.permissions');
            Route::post('/{server}/permissions/{permission}', 'Dashboard\PermissionController@update');
            Route::put('/{server}/permissions', 'Dashboard\PermissionController@create');
            Route::delete('/{server}/permissions/{permission}', 'Dashboard\PermissionController@delete');

            Route::get('/{server}/infractions', 'Dashboard\GeneralController@showInfractions')->name('dashboard.infractions');
            Route::get('/{server}/infractions/{infraction}', 'Dashboard\GeneralController@showInfraction');

            Route::get('/{server}/rolePermissions', 'Dashboard\PermissionController@getRolePermissions');
            Route::put('/{server}/rolePermissions', 'Dashboard\PermissionController@createRolePermission');
            Route::delete('/{server}/rolePermissions/{permission}', 'Dashboard\PermissionController@deleteRolePermission');
            Route::patch('/{server}/rolePermissions/{permission}', 'Dashboard\PermissionController@updateRolePermission');
        });

        Route::get('/{server}/spam', 'Dashboard\SpamController@index')->name('dashboard.spam');
        Route::patch('/{server}/spam', 'Dashboard\SpamController@updateSettings')->name('dashboard.spamUpdate');
        Route::patch('/{server}/censor', 'Dashboard\SpamController@updateCensor')->name('dashboard.censorUpdate');

        // Logging
        Route::group([], function(){
            Route::put('/{server}/logSetting', 'Dashboard\GeneralController@createLogSetting');
            Route::delete('/{server}/logSetting/{setting}', 'Dashboard\GeneralController@deleteLogSetting');
            Route::patch('/{server}/logSetting/{setting}', 'Dashboard\GeneralController@updateLogSetting');
        });
    });
});
Route::post('/dashboard/{server}/channels/{channel}/visibility', 'Dashboard\ChannelController@visibility')->middleware('auth');
Route::get('/archive/{key}', 'Dashboard\GeneralController@showArchived');

Route::group(['prefix' => 'admin'], function () {
    Route::get('/chat', 'BotChatController@index')->middleware('global_admin');
    Route::get('/', 'AdminController@show')->name('admin.main');
});

Route::group(['prefix' => 'server'], function(){
    Route::get('/{server}/commands', 'Dashboard\GeneralController@showCommandList');
    Route::get('/{server}/queue', 'Dashboard\MusicController@displayQueue');
    Route::get('/{server}/quotes', 'Dashboard\GeneralController@showQuotes');
});

Route::get('login', 'AuthController@doLogin')->name('login.do');
Route::get('/auth/login', 'AuthController@showLogin')->name('login');
Route::get('logout', 'AuthController@logout')->name('logout');
