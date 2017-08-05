@extends('layouts.dashboard')

@section('panel')
    <?php
    $color = \App\Menu\Panel::getPanelColor($tab);
    ?>
    <div class="ui {{$color}} segment">
        <div class="container">
            <table class="ui celled table">
                <thead>
                <tr>
                    <th class="one wide">ID</th>
                    <th class="one wide">User</th>
                    <th class="one wide">Action</th>
                    <th class="three wide">Data</th>
                </tr>
                </thead>
                <tbody>
                @foreach($logData as $data)
                    <tr>
                        <td>{{$data->id}}</td>
                        <td>{{$data->acting_user}}</td>
                        <td>{{$data->action}}</td>
                        <td style="word-wrap: break-word; max-width: 500px;">
                            <?php
                            $d = json_decode($data->extra_data)
                            ?>
                            @if(is_string($d))
                                {{$d}}
                            @else
                                <ul>
                                    @foreach($d as $key=>$value)
                                        <li>
                                            <b>{{$key}}:</b> @if(is_array($value)) {{implode(", ", $value)}}@else {{$value}}@endif
                                        </li>
                                    @endforeach
                                </ul>
                            @endif
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            {{$logData->links()}}
        </div>

    </div>
@endsection