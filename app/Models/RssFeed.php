<?php

namespace App\Models;

class RssFeed extends RandomIdModel {
    protected $table = "rss_feeds";

    protected $casts = [
        'failed' => 'boolean',
        'lastCheck' => 'timestamp'
    ];

    protected $fillable = [
        'channel_id', 'server_id', 'feed_url', 'failed'
    ];


    public function server(){
        return $this->belongsTo(Server::class, 'server_id');
    }

    public function items(){
        return $this->hasMany(RssFeedItem::class);
    }
}
