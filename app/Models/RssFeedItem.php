<?php

namespace App\Models;

use App\Models\RandomIdModel;
use App\Models\RssFeed;

class RssFeedItem extends RandomIdModel {
    protected $table = "rss_feed_items";

    protected $fillable = [
        'rss_feed_id', 'guid'
    ];

    public function feed() {
        return $this->belongsTo(RssFeed::class);
    }
}
