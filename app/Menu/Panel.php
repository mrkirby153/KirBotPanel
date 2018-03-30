<?php


namespace App\Menu;


class Panel {

    public static function getServerSettingsTabs() {
        $tabs = [
            new Tab('back', 'dashboard.all', 'left arrow', 'Back'),
            new ServerDashboardSettingsTab('permissions', 'dashboard.permissions', 'shield', 'Permissions', 'blue'),
            new ServerDashboardSettingsTab('general', 'dashboard.general', 'setting', 'General', 'teal'),
            new ServerDashboardSettingsTab('commands', 'dashboard.commands', 'sticky note', 'Commands', 'red'),
            new ServerDashboardSettingsTab('music', 'dashboard.music', 'music', 'Music Settings', 'violet'),
            new ServerDashboardSettingsTab('channels', 'dashboard.channels', 'hashtag', 'Channels', 'orange'),
            new ServerDashboardSettingsTab('infractions', 'dashboard.infractions', 'warning', 'Infractions', 'green'),
            new ServerDashboardSettingsTab('spam', 'dashboard.spam', 'fire extinguisher', 'Spam', 'Red')
        ];
        return $tabs;
    }

    public static function getPanelColor($panel){
        foreach(self::getServerSettingsTabs() as $t){
            if($t->name == $panel){
                if($t instanceof ServerDashboardSettingsTab){
                    return $t->color;
                }
            }
        }
        return "";
    }
}