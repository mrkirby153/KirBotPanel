<?php

use Illuminate\Http\Request;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/chat/servers/{server}', 'BotChatController@getChannels');
Route::post('/chat', 'BotChatController@sendMessage');
Route::get('/chat/servers', 'BotChatController@getServers');

Route::group(['middleware'=>'internal_api', 'prefix'=>'internal'], function(){
    Route::get('/user/{user}/name', 'API\UserController@name');
    Route::post('/user/names', 'API\UserController@names');

    Route::get('/server/{server}/commands', 'API\ServerController@getCommands');
    Route::get('/server/{server}/settings', 'API\ServerController@getSettings');
    Route::post('/server/{server}/name', 'API\ServerController@setName');
    Route::put('/server/{server}/channel', 'API\ServerController@registerChannel');
    Route::put('/server/register', 'API\ServerController@register');
    Route::delete('/server/{server}', 'API\ServerController@unregister');
    Route::put('/server/{server}/message', 'API\ServerController@logMessage');

    Route::delete('/channel/{chanel}', 'API\ServerController@removeChannel');
    Route::patch('/channel/{channel}', 'API\ServerController@updateChannel');
});