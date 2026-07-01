<?php

use App\Services\ApostaService;

beforeEach(function () {
    $this->service = new ApostaService();
});

test('deve calcular o premio corretamente', function () {
    // Simulamos a partida como um objeto com as propriedades que o 'match' espera
    $partida = (object) [
        'odd_mandante' => 2.5,
        'odd_empate' => 3.0,
        'odd_visitante' => 4.0
    ];
    
    // Chamamos o método correto: calcularOdd
    $odd = $this->service->calcularOdd('MANDANTE', $partida);
    
    // Multiplicamos pelo valor da aposta (10.0) para ter o prêmio (25.0)
    $premio = 10.0 * $odd;
    
    expect($premio)->toBe(25.0);
});

test('deve validar saldo insuficiente', function () {
    $podeApostar = $this->service->saldoSuficiente(10.0, 50.0);
    
    expect($podeApostar)->toBeFalse();
});

test('deve validar saldo suficiente', function () {
    $podeApostar = $this->service->saldoSuficiente(100.0, 50.0);
    
    expect($podeApostar)->toBeTrue();
});