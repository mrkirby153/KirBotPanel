<?php


namespace App\Menu;


class Panel {

    public static function getServerSettingsTabs() {
        $tabs = [
            new Tab('back', 'dashboard.all', 'left arrow', 'Back'),
            new ServerDashboardSettingsTab('general', 'dashboard.general', 'setting', 'General')
        ];
        return $tabs;
    }
}