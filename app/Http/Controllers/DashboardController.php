<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{

    public function index()
    {
        return inertia('Dashboard');
    }

public function store(Request $request)
    {
        $validated = $request->validate([
            'jogo_id' => 'required|integer',
            'palpite' => 'required|string',
            'odd' => 'required|numeric',
            'valor' => 'required|numeric|min:1',
            'retorno_potencial' => 'required|numeric',
        ]);

        $aposta = Aposta::create($validated);

        return response()->json([
            'sucesso' => true,
            'aposta_id' => $aposta->id
        ], 201);
    }
 }