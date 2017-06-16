<?php

namespace App\Utils;

class TimeFormatter {


    public static function formatTime($seconds) {
        // Minutes
        $minutes = floor($seconds / 60);
        $seconds = $seconds - ($minutes * 60);
        if ($seconds < 10) {
            $seconds = "0$seconds";
        }
        return "$minutes:$seconds";
    }
}