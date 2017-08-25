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
    Route::get('/server/{server}/channels', 'API\ServerController@getChannels');
    Route::post('/server/{server}/name', 'API\ServerController@setName');
    Route::get('/server/{server}/music', 'API\ServerController@getMusicSettings');
    Route::put('/server/{server}/channel', 'API\ServerController@registerChannel');
    Route::get('/server/{server}/roles', 'API\ServerController@getRoles');
    Route::put('/server/register', 'API\ServerController@register');
    Route::delete('/server/{server}', 'API\ServerController@unregister');

    Route::get('/server/{server}', 'API\ServerController@serverExists');


    Route::delete('/channel/{chanel}', 'API\ServerController@removeChannel');
    Route::patch('/channel/{channel}', 'API\ServerController@updateChannel');

    Route::put('/message', 'API\ServerMessageController@store');
    Route::delete('/message/bulkDelete', 'API\ServerMessageController@bulkDelete');
    Route::delete('/message/{serverMessage}', 'API\ServerMessageController@destroy');
    Route::patch('/message/{serverMessage}', 'API\ServerMessageController@update');
    Route::get('/message/{serverMessage}', 'API\ServerMessageController@show');

    Route::resource('role', 'RoleController');

    Route::get('/server/{server}/quotes', 'API\QuoteController@getServerQuotes');
    Route::get('/server/quote/{quoteId}', 'API\QuoteController@get');
    Route::put('/server/quote', 'API\QuoteController@save');
});