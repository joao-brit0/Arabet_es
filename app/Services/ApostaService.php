<?php

namespace App\Services;

class ApostaService
{
    public function saldoSuficiente(float $saldo, float $valorAposta): bool
    {
        return $saldo >= $valorAposta;
    }

    public function calcularOdd(string $palpite, $partida): float
    {
        return match ($palpite) {
            'MANDANTE'  => $partida->odd_mandante,
            'EMPATE'    => $partida->odd_empate,
            'VISITANTE' => $partida->odd_visitante,
            default     => 0.0,
        };
    }
}