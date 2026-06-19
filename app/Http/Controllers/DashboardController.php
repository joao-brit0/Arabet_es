<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Aposta;
use App\Models\ExtratoApostador;

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
    public function historicoUsuario($idUsuario)
    {
        $extrato = ExtratoApostador::where('id_usuario', $idUsuario)
            ->orderBy('data_aposta', 'desc')
            ->get();

        if ($extrato->isEmpty()) {
            return response()->json(['message' => 'Usuário não encontrado ou sem histórico.'], 404);
        }

        return response()->json($extrato);
    }
 }