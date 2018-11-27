let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css');
if (process.env.NODE_ENV === "production") {
    mix.version();
}

if (process.env.MIX_BROWSERSYNC_ENABLED === "true")
    mix.browserSync(process.env.MIX_BROWSERSYNC_PROXY);
