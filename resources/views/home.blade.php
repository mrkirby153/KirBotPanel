@extends('layouts.semantic_base')

@section('title', 'Home')

@section('body')
    <div class="pusher">
        <div class="ui vertical masthead center aligned segment">
            <div class="ui text container">
                <h1 class="ui header">
                    KirBot
                </h1>
                <h2>The only Discord robot you'll ever need</h2>
                <a href="{{route('dashboard.all')}}" class="ui huge primary button">Get Started
                    <i class="right arrow icon"></i></a>
            </div>

        </div>

        <div class="ui vertical stripe segment">
            <div class="ui center aligned stackable grid container">
                <div class="row">
                    <div class="eight wide column">
                        <h3 class="ui header">Features</h3>
                        <p>Custom Commands, Real Names, Open Source, and many more!</p>
                    </div>
                </div>
                <div class="row">
                    <div class="center aligned column">
                        <a class="ui huge button blue">Check Them Out</a>
                        <a class="ui huge button" href="https://github.com/mrkirby153/KirBot"><i class="github icon"></i> View on GitHub</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection