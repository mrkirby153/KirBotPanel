import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import AdminSettings from './components/admin/AdminSettings';
import ReactDOM from 'react-dom';
import React from 'react';



/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./globals');
require('./bootstrap');

// Include Bootstrap
require('bootstrap');

// Bootstrap the navbar
let navMount = document.getElementById("nav-mount");
if (navMount) {
    ReactDOM.render(<NavBar/>, navMount);
}

let dashMount = document.getElementById("dash-mount");
if(dashMount) {
    ReactDOM.render(<Dashboard/>, dashMount);
}

let adminSettingsMount = document.getElementById('admin-settings-mount');
if(adminSettingsMount) {
    ReactDOM.render(<AdminSettings/>, adminSettingsMount);
}

// Enable hot reload
if(module.hot) {
    module.hot.accept();
}