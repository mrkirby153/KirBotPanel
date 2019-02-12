<?php


namespace App\Utils;


use App\Models\Guild;
use App\Models\GuildSettings;

class SettingsRepository
{


    /**
     * @param Guild|string $guild
     * @param string $key
     * @param null $default
     * @param bool $create
     * @return GuildSettings|\Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model|object|null
     */
    public static function get($guild, $key, $default = null, $create = false)
    {
        $guild_id = ($guild instanceof Guild) ? $guild->id : $guild;

        $settings = GuildSettings::whereGuild($guild_id)->where('key', '=', $key)->first();
        if ($settings == null) {
            if ($create && $default != null) {
                // Don't bother creating a null item
                if (is_object($default) || is_array($default)) {
                    $default = json_encode($default);
                }
                return GuildSettings::create([
                    'guild' => $guild_id,
                    'key' => $key,
                    'value' => $default
                ])->value;
            } else {
                return $default;
            }
        } else {
            return $settings->value;
        }
    }

    /**
     * @param Guild|string $guild
     * @param string $key
     * @param $value
     */
    public static function set($guild, $key, $value)
    {
        $guild_id = ($guild instanceof Guild) ? $guild->id : $guild;
        if ($value == null) {
            try {
                self::delete($guild, $key);
            } catch (\Exception $exception) {
                // Ignore
            }
        }
        if (is_object($value) || is_array($value)) {
            $value = json_encode($value);
        }
        GuildSettings::updateOrCreate(['guild' => $guild_id, 'key' => $key], [
            'guild' => $guild_id,
            'key' => $key,
            'value' => $value
        ]);
    }

    /**
     * @param Guild|string $guild
     * @param string $key
     * @throws \Exception
     */
    public static function delete($guild, $key)
    {
        $guild_id = ($guild instanceof Guild) ? $guild->id : $guild;
        GuildSettings::whereGuild($guild_id)->where('key', '=', $key)->delete();
    }
}