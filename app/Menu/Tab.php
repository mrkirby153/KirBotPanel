<?php


namespace App\Menu;

class Tab
{
    public $name;

    public $route;

    public $icon;

    public $label;


    /**
     * Tab constructor.
     * @param $name
     * @param $route
     * @param $icon
     * @param $label
     */
    public function __construct($name, $route, $icon, $label)
    {
        $this->name = $name;
        $this->route = $route;
        $this->icon = $icon;
        $this->label = $label;
    }
}
