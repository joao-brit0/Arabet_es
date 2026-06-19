<?php

namespace App\Http\Controllers;

use App\Models\Aposta;
use App\Models\Partida;
use App\Models\Apostador;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ApostaController extends Controller
{
    public function apostar(Request $request)
    {
        $request->validate([
            'id_apostador' => 'required',
            'valor_total'  => 'required|numeric|min:0.01',
            'apostas'      => 'required|array',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $apostador = Apostador::lockForUpdate()->find($request->id_apostador);

                if (!$apostador || $apostador->saldo < $request->valor_total) {
                    return response()->json(['error' => 'Saldo insuficiente ou apostador não encontrado.'], 400);
                }

                foreach ($request->apostas as $item) {
                    $partida = Partida::find($item['jogoId']);

                    if (!$partida || $partida->status !== 'AGENDADA') {
                        throw new \Exception("A partida de ID {$item['jogoId']} está indisponível.");
                    }

                    $oddMomento = match ($item['palpite']) {
                        'MANDANTE'  => $partida->odd_mandante,
                        'EMPATE'    => $partida->odd_empate,
                        'VISITANTE' => $partida->odd_visitante,
                        default     => throw new \Exception("Palpite inválido."),
                    };

                    Aposta::create([
                        'id_apostador'      => $request->id_apostador, 
                        'jogo_id'           => $item['jogoId'], 
                        'palpite'           => $item['palpite'],
                        'valor'             => $request->valor_total,
                        'odd'               => $oddMomento, 
                        'retorno_potencial' => $request->valor_total * $oddMomento, 
                    ]);
                }

                $apostador->decrement('saldo', $request->valor_total);

                return response()->json(['message' => 'Bilhete registrado com sucesso!'], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao processar o bilhete.', 
                'details' => $e->getMessage()
            ], 500);
        }
    }
}