<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <meta name="csrf-token" content="{{csrf_token()}}"/>
    <meta name="description" content="A modular an highly configurable Discord moderation bot"/>
    @if(!\Auth::guest())
        <meta name="api-token" content="{{Auth::user()->api_token}}"/>
    @endif
    <title>{{ config('app.name', 'Laravel') }} - @yield('title')</title>
    <link rel="stylesheet" href="{{mix('css/app.css')}}"/>

    <script>
        window.Laravel = {!! json_encode([
            "csrfToken" => csrf_token()
        ]) !!}
            window.App = {!! json_encode([
            "user" => Auth::guest()? null : Auth::user(),
            "readonly" => !(isset($server)? Auth::user()->can('update', $server) : false)
        ]) !!}
    </script>
</head>

<body>
<!-- The main app div -->
@if(env('APP_ENV') == 'local')
    <div class="alert alert-warning mb-0 text-center dev-banner" role="alert">
        The panel is running in development mode.
    </div>
@endif
<!-- Begin Navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="/">{{config('app.name', 'Laravel')}}</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav-mount"
            aria-controls="nav-mount" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="nav-mount">
    </div>
</nav>
<!-- End Navbar -->
@yield('content')

@include('footer')
<!-- Scripts -->
<script src="{{mix('js/manifest.js')}}"></script>
<script src="{{mix('js/vendor.js')}}"></script>
<script src="{{mix('js/app.js')}}"></script>
<!-- Font Awesome -->
<script defer src="https://use.fontawesome.com/releases/v5.5.0/js/solid.js"
        integrity="sha384-Xgf/DMe1667bioB9X1UM5QX+EG6FolMT4K7G+6rqNZBSONbmPh/qZ62nBPfTx+xG"
        crossorigin="anonymous"></script>
<script defer src="https://use.fontawesome.com/releases/v5.5.0/js/fontawesome.js"
        integrity="sha384-bNOdVeWbABef8Lh4uZ8c3lJXVlHdf8W5hh1OpJ4dGyqIEhMmcnJrosjQ36Kniaqm"
        crossorigin="anonymous"></script>
</body>
</html>