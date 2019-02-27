<?php


namespace App\Http\Composers;


use Illuminate\View\View;

class UserComposer
{
    public function compose(View $view) {
        \JavaScript::put([
            'user' => \Auth::user()
        ]);
        return $view;
    }
}