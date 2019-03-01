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
    Route::get('/log-settings', 'ApiController@getLogSettings');
    Route::get('/log-timezone', 'ApiController@getLogTimezone');
    Route::patch('/log-settings/{settings}', 'ApiController@updateLogSettings');
});