<ul class="navbar-nav mr-auto">
    <navbar-link href="{{url('/')}}">Home</navbar-link>
    <navbar-link href="{{route('dashboard.all')}}">Manage Servers</navbar-link>
</ul>
<ul class="navbar-nav">
    @if(Auth::guest())
        <navbar-link href="{{route('login')}}">Log In</navbar-link>
    @else
        <navbar-dropdown name="{{Auth::user()->username}}" direction="right">
            @if(Auth::user()->admin)
                <a class="dropdown-item" href="{{route('admin.main')}}"><i class="fa-btn"><i
                                class="fas fa-cogs"></i></i>Admin</a>
            @endif
            <a class="dropdown-item" href="{{url('/logout')}}"><i class="fa-btn"><i
                            class="fas fa-sign-out-alt "></i></i>Logout</a>
        </navbar-dropdown>
    @endif
</ul>
