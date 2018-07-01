<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta name="csrf-token" content="{{csrf_token()}}"/>
    <title>{{ config('app.name', 'Laravel') }} - @yield('title')</title>
    <link rel="stylesheet" href="{{mix('css/app.css')}}"/>

    <script>
        window.Laravel = {!! json_encode([
            "csrfToken" => csrf_token()
        ]) !!}
            window.App = {!! json_encode([
            "user" => Auth::guest()? null : Auth::user()->load('info'),
            "readonly" => isset($server)? Auth::user()->can('update', $server) : false
        ]) !!}
    </script>
</head>

<body>
<!-- The main app div -->
<div id="app">
    <!-- Begin Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">{{config('app.name', 'Laravel')}}</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            @include('layouts.nav')
        </div>
    </nav>
    <!-- End Navbar -->
    <!-- Put everything in a container -->
    <div class="container-fluid">
        @yield('content')
    </div>
</div>

@include('footer')
<!-- Scripts -->
<script src="{{mix('js/app.js')}}"></script>
<!-- Font Awesome -->
<script defer src="https://use.fontawesome.com/releases/v5.1.0/js/solid.js"
        integrity="sha384-Z7p3uC4xXkxbK7/4keZjny0hTCWPXWfXl/mJ36+pW7ffAGnXzO7P+iCZ0mZv5Zt0"
        crossorigin="anonymous"></script>
<script defer src="https://use.fontawesome.com/releases/v5.1.0/js/fontawesome.js"
        integrity="sha384-juNb2Ils/YfoXkciRFz//Bi34FN+KKL2AN4R/COdBOMD9/sV/UsxI6++NqifNitM"
        crossorigin="anonymous"></script>
</body>
</html>