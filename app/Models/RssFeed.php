<?php

namespace App\Models;

class RssFeed extends RandomIdModel {

    use DeletesRelations;

    protected $table = "rss_feeds";

    protected $casts = [
        'failed' => 'boolean',
        'lastCheck' => 'timestamp'
    ];

    protected $fillable = [
        'channel_id', 'server_id', 'feed_url', 'failed'
    ];

    protected $deletableRelations = [
        'items'
    ];


    public function server(){
        return $this->belongsTo(Server::class, 'server_id');
    }

    public function items(){
        return $this->hasMany(RssFeedItem::class, 'rss_feed_id');
    }
}
