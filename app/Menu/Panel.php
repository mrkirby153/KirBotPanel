<?php


namespace App\Menu;

class Panel
{
    /**
     * @return array
     */
    public static function getServerSettingsTabs()
    {
        $tabs = [
            new Tab('general', 'dashboard.general', 'cog', 'General'),
            new Tab('permissions', 'dashboard.permissions', 'user-shield', 'Permissions'),
            new Tab('commands', 'dashboard.commands', 'sticky-note', 'Commands'),
            new Tab('music', 'dashboard.music', 'music', 'Music'),
            new Tab('infractions', 'dashboard.infractions', 'exclamation-triangle', 'Infractions'),
            new Tab('spam', 'dashboard.spam', 'fire-extinguisher', 'Spam'),
            new Tab('raid', 'dashboard.raid', 'shield-alt', 'Anti-Raid')
        ];
        return $tabs;
    }

    /**
     * @param $name string
     * @return Tab
     */
    public static function getPanelByName($name)
    {
        foreach (self::getServerSettingsTabs() as $tab) {
            if ($tab->name == $name) {
                return $tab;
            }
        }
        return new Tab('error', null, 'exclamation-triangle', 'Unknown tab');
    }
}
