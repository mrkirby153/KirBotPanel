<?php


namespace App\Menu;


class Panel {

    public static function getServerSettingsTabs() {
        $tabs = [
            new Tab('back', 'dashboard.all', 'left arrow', 'Back'),
            new ServerDashboardSettingsTab('general', 'dashboard.general', 'setting', 'General', 'teal'),
            new ServerDashboardSettingsTab('commands', 'dashboard.commands', 'sticky note', 'Commands', 'red'),
            new ServerDashboardSettingsTab('music', 'dashboard.music', 'music', 'Music Settings', 'violet'),
            new ServerDashboardSettingsTab('channels', 'dashboard.channels', 'hashtag', 'Channels', 'orange'),
            new ServerDashboardSettingsTab('log', 'dashboard.log', 'hashtag', 'Log', 'orange'),
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