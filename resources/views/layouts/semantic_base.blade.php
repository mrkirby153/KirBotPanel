<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{csrf_token()}}"/>

    <title>{{ config('app.name', 'Laravel') }} - @yield('title')</title>

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.0/semantic.min.css"
            integrity="sha256-/mC8AIsSmTcTtaf8vgnfbZXZLYhJCd0b9If/M0Y5nDw=" crossorigin="anonymous"/>

    <!-- Scripts -->
    <script>
        window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
        ]) !!};
        window.User = {!! json_encode(Auth::user()) !!}
                @if(!Auth::guest())
            window.User.info = {!! json_encode(Auth::guest()? null : Auth::user()->info) !!}
                @if(isset($server))
            window.ReadOnly = {{ Auth::user()->can('update', $server)? "false" : "true"}}
        @endif
        @endif
    </script>
</head>

<body>
<div id="app">
    <!-- Begin Navigation -->
    <div class="ui menu">
        <a class="item" href="{{url('/')}}"><b>KirBot Control Panel</b></a>
        <a class="item" href="{{url('/name')}}">Real Name</a>
        <a class="item" href="{{url('/servers')}}">Manage Servers</a>
        <div class="right menu">
            @if(Auth::guest())
                <a href="{{url('/login')}}" class="item">Sign in</a>
            @else
                <dropdown-menu class="item">
                    {{Auth::user()->username}}
                    <i class="dropdown icon"></i>
                    <div class="menu">
                        @if(Auth::user()->admin)
                            <a href="{{route('admin.main')}}" class="item">Admin</a>
                        @endif
                        <a href="{{url('/logout')}}" class="item">Log Out</a>
                    </div>
                </dropdown-menu>
            @endif
        </div>
    </div>
    <!-- End Navigation -->

    @yield('body')
</div>

@include('footer')
<!-- Scripts -->
<script src="{{mix('js/app.js')}}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.0/semantic.min.js"
        integrity="sha256-FMQoXFhCWeNb139Wa9Z2I0UjqDeKKDYY+6PLkWv4qco=" crossorigin="anonymous"></script>
@stack('js')
<!-- End Scripts -->
</body>
</html>