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

Route::group(['middleware' => 'internal_api', 'prefix' => 'internal'], function () {

    // -------- /user ------
    Route::group(['prefix' => 'user'], function () {
        Route::get('/{user}/name', 'API\UserController@name');
        Route::post('/names', 'API\UserController@names');
    });

    // -------- /server ------
    Route::group(['prefix' => 'server'], function () {
        Route::get('/{server}/commands', 'API\ServerController@getCommands');
        Route::get('/{server}/settings', 'API\ServerController@getSettings');
        Route::get('/{server}/channels', 'API\ServerController@getChannels');
        Route::post('/{server}/name', 'API\ServerController@setName');
        Route::get('/{server}/music', 'API\ServerController@getMusicSettings');
        Route::put('/{server}/channel', 'API\ServerController@registerChannel');
        Route::get('/{server}/roles', 'API\ServerController@getRoles');
        Route::put('/register', 'API\ServerController@register');
        Route::delete('/{server}', 'API\ServerController@unregister');

        Route::get('/{server}', 'API\ServerController@serverExists');
        Route::get('/{server}/members', 'API\GuildMemberController@getForServer');

        Route::get('/{server}/groups', 'API\GroupController@getServerGroups');
        Route::put('/{server}/groups', 'API\GroupController@createGroup');
        Route::get('/{server}/groups/{name}', 'API\GroupController@getGroupByName');

        Route::get('/{server}/quotes', 'API\QuoteController@getServerQuotes');
        Route::get('/quote/{quoteId}', 'API\QuoteController@get');
        Route::put('/quote', 'API\QuoteController@save');

        Route::get('/{server}/overrides', 'API\ClearanceOverrideController@getOverrides');
        Route::put('/{server}/overrides', 'API\ClearanceOverrideController@createOverride');
    });

    // -------- /message --------
    Route::group(['prefix' => 'message'], function () {
        Route::put('/', 'API\ServerMessageController@store');
        Route::delete('/bulkDelete', 'API\ServerMessageController@bulkDelete');
        Route::delete('/{serverMessage}', 'API\ServerMessageController@destroy');
        Route::patch('/{serverMessage}', 'API\ServerMessageController@update');
        Route::get('/{serverMessage}', 'API\ServerMessageController@show');
    });

    // ------- /channel --------
    Route::group(['prefix' => 'channel'], function () {
        Route::delete('/{chanel}', 'API\ServerController@removeChannel');
        Route::patch('/{channel}', 'API\ServerController@updateChannel');
    });

    // -------- /overrides --------
    Route::group(['prefix' => 'overrides'], function () {
        Route::patch('/{override}', 'API\ClearanceOverrideController@updateOverride');
        Route::delete('/{override}', 'API\ClearanceOverrideController@deleteOverride');
    });

    // -------- /group -------
    Route::group(['prefix' => 'group'], function () {
        Route::get('/{group}', 'API\GroupController@getMembers');
        Route::delete('/{group}', 'API\GroupController@deleteGroup');
        Route::put('/{group}/member', 'API\GroupController@addUserToGroup');
        Route::get('/{group}/members', 'API\GroupController@getMembers');
        Route::delete('/{group}/member/{id}', 'API\GroupController@removeUserByUID');
    });

    // -------- /member --------
    Route::group(['prefix' => 'member'], function () {
        Route::put('/', 'API\GuildMemberController@create');
        Route::get('/{server}/{id}', 'API\GuildMemberController@get');
        Route::patch('/{server}/{id}', 'API\GuildMemberController@update');
        Route::delete('/{server}/{id}', 'API\GuildMemberController@delete');
    });

    // -------- /feed --------
    Route::group(['prefix' => 'feed'], function(){
        Route::get('/server/{server}', 'API\RssController@getForServer');
        Route::get('/{feed}', 'API\RssController@getFeed');
        Route::delete('/{feed}', 'API\RssController@deleteFeed');
        Route::put('/server/{server}', 'API\RssController@registerFeed');
        Route::patch('/server/{server}/check', 'API\RssController@checkFeed');
        Route::put('/{feed}/item', 'API\RssController@registerItem');
    });

    // -------- RESOURCES --------
    Route::resource('role', 'RoleController');

});