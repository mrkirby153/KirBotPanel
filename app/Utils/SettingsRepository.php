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
     * @param array $keys
     * @return array
     */
    public static function getMultiple($guild, $keys)
    {
        $guild_id = ($guild instanceof Guild) ? $guild->id : $guild;
        $settings = GuildSettings::whereGuild($guild_id)->whereIn('key', $keys)->get();
        $values = [];
        foreach ($settings as $setting) {
            $values[$setting->key] = $setting->value;
        }
        foreach ($keys as $key) {
            if (!isset($values[$key])) {
                $values[$key] = null;
            }
        }
        return $values;
    }


    /**
     * @param Guild|string $guild
     * @param array $keys
     */
    public static function setMultiple($guild, $keys)
    {
        foreach ($keys as $k => $v) {
            self::set($guild, $k, $v);
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
            return;
        }
        $value = self::encode($value);
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

    /**
     * @param $value
     * @return false|string
     */
    public static function encode($value)
    {
        if (is_object($value) || is_array($value)) {
            $value = json_encode($value);
        } else {
            if (is_numeric($value) && ($value + 0 > 9007199254740991)) {
                $value = "\"$value\"";
            }
        }
        return $value;
    }
}