@if ($paginator->hasPages())
    <div class="ui pagination menu">
        @if($paginator->onFirstPage())
            <a class="disabled item">&laquo;</a>
        @else
            <a href="{{$paginator->previousPageUrl()}}" class="item" rel="prev">&laquo;</a>
        @endif
            @foreach ($elements as $element)
                {{-- "Three Dots" Separator --}}
                @if (is_string($element))
                    <a class="disabled item"><span>{{ $element }}</span></a>
                @endif

                {{-- Array Of Links --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <a class="active item"><span>{{ $page }}</span></a>
                        @else
                            <a href="{{ $url }}" class="item">{{ $page }}</a>
                        @endif
                    @endforeach
                @endif
            @endforeach

            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}" class="item" rel="next">&raquo;</a></li>
            @else
                <a class="disabled item"><span>&raquo;</span></a>
            @endif
    </div>
@endif
