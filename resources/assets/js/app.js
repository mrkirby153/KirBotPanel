/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

// Include Bootstrap
require('bootstrap');

require('./form/form2');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example', require('./components/Example.vue'));
Vue.component('form-messages', require('./components/Messages.vue'));
Vue.component('panel-form', require('./components/Form.vue'));
Vue.component('field', require('./components/Field.vue'));
Vue.component('dropdown', require('./components/Dropdown'));
Vue.component('dropdown-menu', require('./components/DropdownMenu'));
Vue.component('input-switch', require('./components/Switch'));

require('./components/ServerDashboard');
require('./components/BotChat');
require('./components/MusicQueue');

require('./components/nav/bootstrapper');

const app = new Vue({
    el: '#app'
});
