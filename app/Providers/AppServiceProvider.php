<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Validator;

class AppServiceProvider extends ServiceProvider {
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot() {
        // Fix for MariaDB < 10.2.2 and MySQL < 5.7.7
        \Schema::defaultStringLength(191);
        Validator::extend('without_spaces', function($attr, $value){
            return preg_match('/^\S*$/u', $value);
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register() {
    }
}
