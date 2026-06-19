<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/dash', function () {
    return view('dash');
});
Route::get('/dashboard', [DashboardController::class, 'index']);
