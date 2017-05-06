<?php


namespace App\Menu;


class ServerDashboardSettingsTab extends Tab {

    public $color;

    public function __construct($name, $route, $icon, $label, $color) {
        parent::__construct($name, $route, $icon, $label);
        $this->color = $color;
    }
}