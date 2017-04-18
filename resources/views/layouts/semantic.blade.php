<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{csrf_token()}}"/>

    <title>{{ config('app.name', 'Laravel') }} - @yield('title')</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.css"
            integrity="sha256-5+W3JHnvGYIJkVxUBsw+jBi9+pOlu9enPX3vZapXj5M=" crossorigin="anonymous"/>

    <!-- Scripts -->
    <script>
        window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
        ]) !!};
    </script>
</head>

<body>
<div id="app">
    <!-- Begin Navigation -->
    <div class="ui menu">
        <a class="item"><b>KirBot Control Panel</b></a>
        <a class="item">Real Name</a>
        <div class="right menu">
            @if(Auth::guest())
                <a href="{{url('/login')}}" class="item">Sign in</a>
            @else
                <div class="ui dropdown item">
                    {{Auth::user()->username}}
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        <a href="{{url('/logout')}}" class="item">Log Out</a>
                    </div>
                </div>
            @endif
        </div>
    </div>
    <!-- End Navigation -->

    <div class="ui container">
        <div class="ui grid">
            <div class="row">
                <div class="column">
                    <h1 class="ui header centered">@yield('title')</h1>
                    <div class="ui divider"></div>
                    @yield('content')
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Scripts -->
<script src="{{asset('js/app.js')}}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.js"
        integrity="sha256-97Q90i72uoJfYtVnO2lQcLjbjBySZjLHx50DYhCBuJo=" crossorigin="anonymous"></script>
@stack('js')
<!-- End Scripts -->
</body>
</html>