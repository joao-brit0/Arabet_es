<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;


Route::get('/', function () {
    return Inertia::render('Home');
});

Route::middleware('guest')->group(function () {
    Route::get('/cadastro', [AuthController::class, 'create'])->name('cadastro.index');
    Route::post('/cadastro', [AuthController::class, 'store'])->name('cadastro.store');
    
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticate'])->name('login.authenticate');
});


// ==========================================
// ROTAS PROTEGIDAS (Usuários Logados)
// ==========================================
// O middleware 'auth' garante que apenas usuários autenticados entrem aqui
Route::middleware('auth')->group(function () {
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/perfil', function () {
        return Inertia::render('perfil'); 
    })->name('perfil');

    Route::get('/admin', function () {
        if (auth()->user()->tipo !== 'ADMINISTRADOR') {
            return redirect('/dashboard')->withErrors(['error' => 'Acesso negado.']);
        }
        return Inertia::render('AdminPanel');
    })->name('admin.panel');

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
