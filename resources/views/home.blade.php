@extends('layouts.master')

@section('title', 'Home')

@section('content')
    <div class="row" id="home-page">
        <div class="col-lg-6 offset-lg-3 mt-3">
            <h1 class="header">KirBot</h1>
            <h2 class="tagline">A modular and highly configurable moderation bot</h2>
            <div class="action-buttons">
                <a class="btn btn-lg btn-primary" href="/add">Add KirBot to your server</a>
                <a class="btn btn-lg btn-secondary" href="/docs">Read the documentation</a>
            </div>

            <div class="cards">
                <div class="card">
                    <div class="card-body">
                        <i class="fas fa-shield-alt card-icon"></i>
                        <h5 class="card-title">Anti-Raid</h5>
                        <p class="card-text">
                            Quickly and efficiently clean up raids
                        </p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <i class="fas fa-bolt card-icon"></i>
                        <h5 class="card-title">Auto Mod</h5>
                        <p class="card-text">
                            Highly configurable auto mod to handle any server's needs
                        </p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <i class="fas fa-book card-icon"></i>
                        <h5 class="card-title">Much More</h5>
                        <p class="card-text">
                            See the documentation for a full list of features
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection