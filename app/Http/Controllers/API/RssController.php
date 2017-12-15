<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RssFeed;
use App\Models\Server;
use App\RssFeedItem;
use Carbon\Carbon;
use Illuminate\Http\Request;

class RssController extends Controller {

    /**
     * @var RssFeed
     */
    private $feed;

    /**
     * @var RssFeedItem
     */
    private $items;


    public function __construct(RssFeedItem $items, RssFeed $feed) {
        $this->feed = $feed;
        $this->items = $items;
    }


    public function getForServer(Server $server){
        return $server->feeds()->with('items')->get();
    }

    public function deleteFeed(RssFeed $feed){
        $this->items->whereRssFeedId($feed->id)->delete();
        $feed->delete();
    }

    public function registerFeed(Request $request, Server $server){
        $request->validate([
            'channel_id' => 'required',
            'feed_url' => 'required|url'
        ]);
        return $server->feeds()->create($request->all());
    }

    public function checkFeed(Request $request){
        $request->validate([
            'feed' => 'required|exists:rss_feeds,id',
            'success' => 'required|boolean'
        ]);

        $feed = $this->feed->firstOrFail(['id' => $request->get('feed')]);
        $feed->lastCheck = Carbon::now();
        $feed->failed = !$request->get('success');
        $feed->save();
        return $feed;
    }

    public function registerItem(Request $request, RssFeed $feed){
        $request->validate([
            'guid' => 'required'
        ]);
       return $feed->items()->create($request->all());
    }
}
