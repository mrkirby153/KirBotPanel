<?php
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/chat/servers/{server}', 'BotChatController@getChannels');
Route::post('/chat', 'BotChatController@sendMessage');
Route::get('/chat/servers', 'BotChatController@getServers');
Route::get('/{server}/queue', 'Dashboard\MusicController@getQueueJson');

// Authenticated routes
Route::get('/user', 'ApiController@getCurrentUser');
Route::get('/log-events', 'ApiController@getLogEvents');

Route::group(['prefix' => '/guild/{guild}'], function () {
    Route::patch('/setting', 'ApiController@apiSetting');
    Route::get('/log-settings', 'ApiController@getLogSettings');
    Route::put('/log-settings', 'ApiController@createLogSettings');
    Route::patch('/log-settings/{settings}', 'ApiController@updateLogSettings');
    Route::delete('/log-settings/{settings}', 'ApiController@deleteLogSettings');
    Route::post('/bot-nick', 'ApiController@setBotNick');
    Route::post('/muted-role', 'ApiController@setMutedRole');

    Route::get('/permissions/panel', 'ApiController@getPanelPermissions');
    Route::patch('/permissions/panel/{permission}', 'ApiController@updatePanelPermission');
    Route::put('/permissions/panel', 'ApiController@createPanelPermission');
    Route::delete('/permissions/panel/{permission}', 'ApiController@deletePanelPermission');

    Route::get('/permissions/role', 'ApiController@getRolePermissions');
    Route::patch('/permissions/role/{permission}', 'ApiController@updateRolePermissions');
    Route::put('/permissions/role', 'ApiController@createRolePermissions');
    Route::delete('/permissions/role/{permission}', 'ApiController@deleteRolePermissions');
});