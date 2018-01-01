<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RssFeed;
use App\Models\Server;
use App\Models\RssFeedItem;
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


    public function getForServer(Server $server) {
        return ["feeds" => $server->feeds()->with('items')->get()];
    }

    public function getFeed(RssFeed $feed) {
        $feed->load('items');
        return ["feed" => $feed];
    }

    public function deleteFeed(RssFeed $feed) {
        $this->items->whereRssFeedId($feed->id)->delete();
        $feed->delete();
    }

    public function registerFeed(Request $request, Server $server) {
        $request->validate([
            'channel_id' => 'required',
            'feed_url' => 'required|url'
        ]);
        return $server->feeds()->create($request->all());
    }

    public function checkFeed(Request $request) {
        $request->validate([
            'feed' => 'required|exists:rss_feeds,id',
            'success' => 'required'
        ]);

        $feed = $this->feed->whereId($request->get('feed'))->firstOrFail();
        $feed->lastCheck = Carbon::now();
        $feed->failed = !($request->get('success') == "true"? true : false);
        $feed->save();
        return $feed;
    }

    public function registerItem(Request $request, RssFeed $feed) {
        $request->validate([
            'guid' => 'required'
        ]);
        return $feed->items()->create($request->all());
    }
}
