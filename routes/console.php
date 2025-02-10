<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

if (app()->environment('production')) {
    Schedule::command(\Spatie\Health\Commands\RunHealthChecksCommand::class)->everyFiveSeconds();
} else {
    Schedule::command(\Spatie\Health\Commands\RunHealthChecksCommand::class)->everyFourHours();
}
